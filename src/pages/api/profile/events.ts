import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prismadb from "@/providers/prismaclient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // GET user events
  if (req.method === "GET") {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // Step 1: Get attendance records for the user
      const attendanceRecords = await prismadb.attendance.findMany({
        where: {
          userId: session.user.id,
          // You can also add a specific status filter here if needed
        },
        select: {
          eventId: true,
          status: true,
        },
      });

      // Step 2: Extract event IDs from the attendance records
      const eventIds = attendanceRecords.map((record) => record.eventId);

      // Step 3: Fetch events based on the event IDs
      const userEvents = await prismadb.event.findMany({
        where: {
          id: { in: eventIds },
        },
        orderBy: { startDate: "desc" },
        skip: skip,
        take: Number(limit),
        select: {
          id: true,
          title: true,
          description: true,
          startDate: true,
          endDate: true,
          location: true,
          capacity: true,
          logo: true,
          photos: true,
          contactEmail: true,
          contactPhone: true,
          hostName: true,
          hostDescription: true,
          attendance: {
            // Include attendance data if needed
            select: {
              userId: true,
              status: true,
            },
          },
        },
      });

      // Get total count for pagination (total events)
      const totalEvents = await prismadb.event.count({
        where: {
          id: { in: eventIds },
        },
      });

      return res.status(200).json({
        events: userEvents,
        pagination: {
          total: totalEvents,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(totalEvents / Number(limit)),
        },
      });
    } catch (error) {
      console.error("Events fetch error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // DELETE event
  if (req.method === "DELETE") {
    try {
      const { eventId } = req.query;
  
      if (!eventId) {
        return res.status(400).json({ message: "Event ID is required" });
      }
  
      const eventIdNum = parseInt(eventId as string);
  
      // Verify event belongs to user
      const event = await prismadb.event.findFirst({
        where: {
          id: eventIdNum,
          organizerId: session.user.id,
        },
      });
  
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      // Delete all related records first using transaction
      await prismadb.$transaction(async (tx) => {
        // Delete special guests
        await tx.specialGuest.deleteMany({
          where: { eventId: eventIdNum }
        });
  
        // Delete social links if they exist
        if (event.socialLinksId) {
          await tx.socialLinks.delete({
            where: { id: event.socialLinksId }
          });
        }
  
        // Delete attendance records
        await tx.attendance.deleteMany({
          where: { eventId: eventIdNum }
        });
  
        // Finally delete the event
        await tx.event.delete({
          where: { id: eventIdNum }
        });
      });
  
      return res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Event deletion error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { eventId } = req.body;

      if (!eventId) {
        return res.status(400).json({ message: "Event ID is required" });
      }

      // Update the attendance status to CANCELLED
      const updatedAttendance = await prismadb.attendance.updateMany({
        where: {
          eventId: parseInt(eventId as string),
          userId: session.user.id,
        },
        data: {
          status: "CANCELLED",
        },
      });

      if (updatedAttendance.count === 0) {
        return res.status(404).json({ message: "Attendance record not found" });
      }

      return res.status(200).json({ message: "Event cancelled successfully" });
    } catch (error) {
      console.error("Event cancellation error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
