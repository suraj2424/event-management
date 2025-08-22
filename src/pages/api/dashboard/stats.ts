import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prismadb from "@/providers/prismaclient";

// Role-aware dashboard stats for Pages Router
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ message: "Unauthorized" });

    const role = session.user.role;
    const userId = session.user.id;

    const now = new Date();
    const activeStatuses = ["REGISTERED", "CONFIRMED", "ATTENDED"] as const;

    if (role === "ORGANIZER") {
      const where = { organizerId: userId } as const;

      const [totalEvents, upcomingEvents, ongoingEvents, pastEvents] = await Promise.all([
        prismadb.event.count({ where }),
        prismadb.event.count({ where: { ...where, startDate: { gt: now } } }),
        prismadb.event.count({ where: { ...where, startDate: { lte: now }, endDate: { gte: now } } }),
        prismadb.event.count({ where: { ...where, endDate: { lt: now } } }),
      ]);

      const totalAttendees = await prismadb.attendance.count({
        where: { event: { organizerId: userId }, status: { in: activeStatuses as any } },
      });

      return res.status(200).json({ totalEvents, upcomingEvents, ongoingEvents, pastEvents, totalAttendees });
    }

    if (role === "ADMIN") {
      const [totalEvents, upcomingEvents, ongoingEvents, pastEvents, totalAttendees] = await Promise.all([
        prismadb.event.count(),
        prismadb.event.count({ where: { startDate: { gt: now } } }),
        prismadb.event.count({ where: { startDate: { lte: now }, endDate: { gte: now } } }),
        prismadb.event.count({ where: { endDate: { lt: now } } }),
        prismadb.attendance.count({ where: { status: { in: activeStatuses as any } } }),
      ]);

      return res.status(200).json({ totalEvents, upcomingEvents, ongoingEvents, pastEvents, totalAttendees });
    }

    // ATTENDEE
    const registrations = await prismadb.attendance.findMany({
      where: { userId, status: { in: activeStatuses as any } },
      select: { eventId: true },
    });
    const eventIds = registrations.map((r: { eventId: number }) => r.eventId);

    const [totalEvents, upcomingEvents, ongoingEvents, pastEvents] = await Promise.all([
      prismadb.event.count({ where: { id: { in: eventIds } } }),
      prismadb.event.count({ where: { id: { in: eventIds }, startDate: { gt: now } } }),
      prismadb.event.count({ where: { id: { in: eventIds }, startDate: { lte: now }, endDate: { gte: now } } }),
      prismadb.event.count({ where: { id: { in: eventIds }, endDate: { lt: now } } }),
    ]);

    const totalAttendees = registrations.length;

    return res.status(200).json({ totalEvents, upcomingEvents, ongoingEvents, pastEvents, totalAttendees });
  } catch (error) {
    console.error("dashboard/stats error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
