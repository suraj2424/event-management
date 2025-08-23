// pages/api/events/manage.ts
import { NextApiRequest, NextApiResponse } from "next";
import type { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prismadb from "@/providers/prismaclient";
import { z } from "zod";

const updateEventSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  hostName: z.string().optional(),
  hostDescription: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  currency: z.string().length(3).optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Auth check
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if user is organizer
  if (session.user.role !== "ORGANIZER") {
    return res.status(403).json({ message: "Forbidden - Organizer access only" });
  }

  try {
    // GET events created by user (single or list)
    if (req.method === "GET") {
      const { id } = req.query as { id?: string };
      // Single event for edit page
      if (id) {
        const event = await prismadb.event.findFirst({
          where: { id: Number(id), organizerId: session.user.id },
          select: {
            id: true,
            title: true,
            description: true,
            startDate: true,
            endDate: true,
            location: true,
            capacity: true,
            contactEmail: true,
            contactPhone: true,
            hostName: true,
            hostDescription: true,
            price: true,
            currency: true,
            logo: true,
            photos: true,
          },
        });
        if (!event) return res.status(404).json({ message: "Event not found" });
        return res.status(200).json({ event });
      }

      const { page = 1, limit = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const now = new Date();
      const activeStatuses = ["REGISTERED", "CONFIRMED", "ATTENDED"] as const;

      const baseEvents = await prismadb.event.findMany({
        where: { organizerId: session.user.id },
        skip,
        take: Number(limit),
        orderBy: { startDate: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          startDate: true,
          endDate: true,
          location: true,
          capacity: true,
        },
      });

      type BaseEvent = {
        id: number;
        title: string;
        description: string | null;
        startDate: Date | string;
        endDate: Date | string;
        location: string;
        capacity: number;
      };

      const events = await Promise.all(
        baseEvents.map(async (ev: BaseEvent) => {
          const attendeeCount = await prismadb.attendance.count({
            where: { eventId: ev.id, status: { in: activeStatuses as any } },
          });

          let status: "UPCOMING" | "ONGOING" | "PAST" = "UPCOMING";
          const start = new Date(ev.startDate);
          const end = new Date(ev.endDate);
          if (now > end) status = "PAST";
          else if (now >= start && now <= end) status = "ONGOING";

          return {
            id: String(ev.id),
            title: ev.title,
            description: ev.description,
            startDate: ev.startDate as unknown as string,
            endDate: ev.endDate as unknown as string,
            location: ev.location,
            capacity: ev.capacity,
            attendeeCount,
            status,
          };
        })
      );

      const total = await prismadb.event.count({
        where: { organizerId: session.user.id },
      });

      return res.status(200).json({
        events,
        pagination: {
          total,
          pages: Math.ceil(total / Number(limit)),
          page: Number(page),
          limit: Number(limit),
        },
      });
    }

    // UPDATE event
    if (req.method === "PUT") {
      const { id, ...updateData } = req.body;
      
      if (!id) {
        return res.status(400).json({ message: "Event ID is required" });
      }

      // Validate event exists and belongs to user
      const existingEvent = await prismadb.event.findFirst({
        where: { 
          id: Number(id),
          organizerId: session.user.id
        }
      });

      if (!existingEvent) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Validate update data
      const validatedData = updateEventSchema.parse(updateData);

      const updatedEvent = await prismadb.event.update({
        where: { id: Number(id) },
        data: validatedData
      });

      return res.status(200).json(updatedEvent);
    }

    // DELETE event
    if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: "Event ID is required" });
      }

      // Verify event exists and belongs to user
      const event = await prismadb.event.findFirst({
        where: { 
          id: Number(id),
          organizerId: session.user.id
        }
      });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      const eventIdNum = Number(id);

      await prismadb.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.specialGuest.deleteMany({ where: { eventId: eventIdNum } });
        if (event.socialLinksId) {
          await tx.socialLinks.delete({ where: { id: event.socialLinksId } });
        }
        await tx.attendance.deleteMany({ where: { eventId: eventIdNum } });
        await tx.event.delete({ where: { id: eventIdNum } });
      });

      return res.status(200).json({ message: "Event deleted successfully" });
    }

    return res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error("Event management error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}