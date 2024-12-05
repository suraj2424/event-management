// pages/api/events/manage.ts
import { NextApiRequest, NextApiResponse } from "next";
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
  hostDescription: z.string().optional()
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
    // GET events created by user
    if (req.method === "GET") {
      const { page = 1, limit = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const events = await prismadb.event.findMany({
        where: { organizerId: session.user.id },
        skip,
        take: Number(limit),
        orderBy: { id: "desc" },
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
          location: true,
          capacity: true,
          logo: true
        }
      });

      const total = await prismadb.event.count({
        where: { organizerId: session.user.id }
      });

      return res.status(200).json({
        events,
        pagination: {
          total,
          pages: Math.ceil(total / Number(limit)),
          page: Number(page),
          limit: Number(limit)
        }
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

      await prismadb.event.delete({
        where: { id: Number(id) }
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