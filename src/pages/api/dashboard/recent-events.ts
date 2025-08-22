import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prismadb from "@/providers/prismaclient";

type EventBase = {
  id: number;
  title: string;
  startDate: Date | string;
  endDate: Date | string;
  location: string;
  capacity: number;
};

// Role-aware recent events for Pages Router
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ message: "Unauthorized" });

    const role = session.user.role;
    const userId = session.user.id;

    const limit = parseInt((req.query.limit as string) || "5", 10);
    const now = new Date();
    const activeStatuses = ["REGISTERED", "CONFIRMED", "ATTENDED"] as const;

    const computeStatus = (start: Date, end: Date) => {
      if (now > end) return "PAST" as const;
      if (now >= start && now <= end) return "ONGOING" as const;
      return "UPCOMING" as const;
    };

    if (role === "ORGANIZER") {
      const events = await prismadb.event.findMany({
        where: { organizerId: userId },
        orderBy: { startDate: "desc" },
        take: limit,
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
          location: true,
          capacity: true,
        },
      });

      const enriched = await Promise.all(
        events.map(async (ev: EventBase) => {
          const attendeeCount = await prismadb.attendance.count({
            where: { eventId: ev.id, status: { in: activeStatuses as any } },
          });
          return {
            id: String(ev.id),
            title: ev.title,
            startDate: ev.startDate as unknown as string,
            location: ev.location,
            attendeeCount,
            capacity: ev.capacity,
            status: computeStatus(new Date(ev.startDate), new Date(ev.endDate)),
          };
        })
      );

      return res.status(200).json({ events: enriched });
    }

    if (role === "ADMIN") {
      const events = await prismadb.event.findMany({
        orderBy: { startDate: "desc" },
        take: limit,
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
          location: true,
          capacity: true,
        },
      });

      const enriched = await Promise.all(
        events.map(async (ev: EventBase) => {
          const attendeeCount = await prismadb.attendance.count({
            where: { eventId: ev.id, status: { in: activeStatuses as any } },
          });
          return {
            id: String(ev.id),
            title: ev.title,
            startDate: ev.startDate as unknown as string,
            location: ev.location,
            attendeeCount,
            capacity: ev.capacity,
            status: computeStatus(new Date(ev.startDate), new Date(ev.endDate)),
          };
        })
      );

      return res.status(200).json({ events: enriched });
    }

    // ATTENDEE
    const registrations = await prismadb.attendance.findMany({
      where: { userId, status: { in: activeStatuses as any } },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { eventId: true },
    });
    const eventIds = registrations.map((r: { eventId: number }) => r.eventId);

    const events = await prismadb.event.findMany({
      where: { id: { in: eventIds } },
      orderBy: { startDate: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        location: true,
        capacity: true,
      },
    });

    const enriched = await Promise.all(
      events.map(async (ev: EventBase) => {
        const attendeeCount = await prismadb.attendance.count({
          where: { eventId: ev.id, status: { in: activeStatuses as any } },
        });
        return {
          id: String(ev.id),
          title: ev.title,
          startDate: ev.startDate as unknown as string,
          location: ev.location,
          attendeeCount,
          capacity: ev.capacity,
          status: computeStatus(new Date(ev.startDate), new Date(ev.endDate)),
        };
      })
    );

    return res.status(200).json({ events: enriched });
  } catch (error) {
    console.error("dashboard/recent-events error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
