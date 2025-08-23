import { NextApiRequest, NextApiResponse } from "next";
import { createRouter, NextHandler } from "next-connect";
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

// Helper function to upload file to S3
const uploadToS3 = async (
  file: Express.Multer.File,
  eventTitle: string,
  folder: string
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: `${eventTitle}/${folder}/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  });
  await s3Client.send(command);
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${eventTitle}/${folder}/${file.originalname}`;
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

router.get(async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const skip = (page - 1) * limit;
    const eventType = (req.query.type as string) || "all";
    const search = (req.query.search as string)?.trim() || "";

    const currentDate = new Date();

    // Define filter based on event type
    let filter:
      | { AND?: Array<{ startDate?: { lte: Date }; endDate?: { gte: Date } }>; OR?: any[] }
      | { startDate?: { gt: Date }; OR?: any[] }
      | { endDate?: { lt: Date }; OR?: any[] }
      | { OR?: any[] } = {};
    switch (eventType) {
      case "upcoming":
        filter = { startDate: { gt: currentDate } };
        break;
      case "ongoing":
        filter = {
          AND: [
            { startDate: { lte: currentDate } },
            { endDate: { gte: currentDate } },
          ],
        };
        break;
      case "past":
        filter = { endDate: { lt: currentDate } };
        break;
      // 'all' doesn't need a filter
    }

    // Apply search filter (title, description, location, hostName)
    if (search) {
      const or = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
        { location: { contains: search, mode: 'insensitive' as const } },
        { hostName: { contains: search, mode: 'insensitive' as const } },
      ];
      if ('AND' in filter || 'startDate' in filter || 'endDate' in filter) {
        (filter as any).OR = or;
      } else {
        filter = { OR: or };
      }
    }

    // const cacheKey = { page, limit, type: eventType };
    // const cachedResult = await eventRedis.getCachedEventList(cacheKey);

    // if (cachedResult) {
    //   return res.status(200).json(cachedResult);
    // }

    // Fetch filtered and paginated events from the database
    const events = await prismadb.event.findMany({
      where: filter,
      skip,
      take: limit,
      // Exclude heavy relations to reduce payload size for list page
      orderBy: {
        startDate: "asc",
      },
    });

    // Add status to each event based on the current date
    const eventsWithStatus = events.map((event) => {
      let status = "UPCOMING";
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      if (currentDate > endDate) {
        status = "PAST";
      } else if (currentDate >= startDate && currentDate <= endDate) {
        status = "ONGOING";
      }

      return {
        ...event,
        status,
      };
    });

    // Get total count of filtered events
    const totalEvents = await prismadb.event.count({ where: filter });

    // Calculate total pages
    const totalPages = Math.ceil(totalEvents / limit);

    // await eventRedis.cacheEventList(cacheKey, eventsWithStatus, totalPages, totalEvents);

    res.status(200).json({
      events: eventsWithStatus,
      currentPage: page,
      totalPages,
      totalEvents,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      error: "Error fetching events",
      details: (error as Error).message,
    });
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
