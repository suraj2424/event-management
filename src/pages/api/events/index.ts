import { NextApiRequest, NextApiResponse } from "next";
import { createRouter, NextHandler } from "next-connect";
import { buildEventFilter, getEventStatus } from "@/lib/event-filters";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";
import prismadb from "@/providers/prismaclient";
// import { eventRedis } from "@/lib/redis";

// Type for request with files
interface NextApiRequestWithFiles extends NextApiRequest {
  files?: {
    logo?: Express.Multer.File[];
    photos?: Express.Multer.File[];
  };
}

// S3 client setup
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Multer setup
const upload = multer({ storage: multer.memoryStorage() });
const uploadMiddleware = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "photos", maxCount: 10 },
]);

const SocialLinkSchema = z.object({
  facebook: z.string().url().optional(),
  twitter: z.string().url().optional(),
  instagram: z.string().url().optional(),
});

const SpecialGuestSchema = z.array(
  z.object({
    guestName: z.string(),
    guestDescription: z.string(),
  })
);

const EventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end date",
  }),
  location: z.string().min(1, "Location is required"),
  capacity: z.coerce
    .number()
    .int()
    .positive("Capacity must be a positive integer"),
  organizerId: z.string().min(1, "Organizer ID is required"),
  contactEmail: z.string().email("Invalid email"),
  contactPhone: z.string().optional(),
  hostName: z.string().min(1, "Host name is required"),
  hostDescription: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  currency: z.string().length(3).optional(),
  socialLinks: SocialLinkSchema.optional(),
  specialGuests: SpecialGuestSchema.optional(),
});

// Improved S3 Helper: Slugify title and add timestamp to prevent collisions
const uploadToS3 = async (file: Express.Multer.File, eventTitle: string, folder: string): Promise<string> => {
  const safeTitle = eventTitle.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const fileName = `${Date.now()}-${file.originalname}`;
  const key = `events/${safeTitle}/${folder}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
};

// Error handler middleware
const errorHandler = (
  err: Error & { statusCode?: number },
  req: NextApiRequestWithFiles,
  res: NextApiResponse,
  next: NextHandler
) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    error: err.message || "An unexpected error occurred",
  });
  next();
};

// Create router
const router = createRouter<NextApiRequestWithFiles, NextApiResponse>();

// Helper to run multer only for POST
const runUploadMiddleware = (
  req: NextApiRequestWithFiles,
  res: NextApiResponse
) =>
  new Promise<void>((resolve, reject) => {
    (uploadMiddleware as unknown as (
      req: NextApiRequestWithFiles,
      res: NextApiResponse,
      next: (err?: unknown) => void
    ) => void)(req, res, (result?: unknown) => {
      if (result instanceof Error) return reject(result);
      return resolve();
    });
  });

// POST route for event creation
router.post(async (req, res) => {
  try {
    // Run file upload middleware only for POST requests
    await runUploadMiddleware(req, res);
    console.log(req.body); // FormData fields
    // Parse the JSON data from FormData
    const eventData = JSON.parse(req.body.eventData);

    // Validate the parsed data
    const validatedData = EventSchema.parse(eventData);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let logoUrl = null;
    let photoUrls: string[] = [];

    if (files.logo) {
      logoUrl = await uploadToS3(files.logo[0], validatedData.title, "logo");
    }

    if (files.photos) {
      photoUrls = await Promise.all(
        files.photos.map((photo) =>
          uploadToS3(photo, validatedData.title, "photos")
        )
      );
    }

    const socialLinks = validatedData.socialLinks
      ? {
          create: validatedData.socialLinks,
        }
      : undefined;

    const event = await prismadb.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        location: validatedData.location,
        capacity: validatedData.capacity,
        contactEmail: validatedData.contactEmail,
        contactPhone: validatedData.contactPhone || "",
        hostName: validatedData.hostName,
        hostDescription: validatedData.hostDescription || "",
        logo: logoUrl || "",
        photos: photoUrls,
        organizer: { connect: { id: validatedData.organizerId } },
        // Pricing
        ...(validatedData.price != null ? { price: validatedData.price } : {}),
        ...(validatedData.currency ? { currency: validatedData.currency } : {}),
        socialLinks,
        specialGuests: validatedData.specialGuests
          ? {
              create: validatedData.specialGuests.map((guest) => ({
                guestName: guest.guestName,
                guestDescription: guest.guestDescription,
              })),
            }
          : undefined,
      },
      include: {
        organizer: true,
        socialLinks: true,
        specialGuests: true,
      },
    });

    // await eventRedis.cacheEvent(event.id.toString(), event);
    // await eventRedis.invalidateEventCaches(); // Clear list caches

    res.status(201).json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// GET Route refactored
router.get(async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const eventType = (req.query.type as string) || "all";
    const search = (req.query.search as string)?.trim() || "";
    
    const filter = buildEventFilter(eventType, search);

    const [events, totalEvents] = await Promise.all([
      prismadb.event.findMany({
        where: filter,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startDate: "asc" },
      }),
      prismadb.event.count({ where: filter })
    ]);

    const eventsWithStatus = events.map(event => ({
      ...event,
      status: getEventStatus(event.startDate, event.endDate)
    }));

    res.status(200).json({
      events: eventsWithStatus,
      currentPage: page,
      totalPages: Math.ceil(totalEvents / limit),
      totalEvents,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Error fetching events", details: error.message });
  }
});

// Apply error handler
router.use(
  errorHandler as unknown as (
    req: NextApiRequestWithFiles,
    res: NextApiResponse,
    next: NextHandler
  ) => void
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default router.handler();
