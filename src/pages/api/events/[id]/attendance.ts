import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prismadb from "@/providers/prismaclient";
import { generateTicketNumber, generateQRCode } from "@/lib/ticket-utils"; // Move helpers here

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return res.status(401).json({ message: "Unauthorized" });

  const eventId = Number(req.query.id);
  const userId = session.user.id;

  try {
    const event = await prismadb.event.findUnique({
      where: { id: eventId },
      select: { organizerId: true, capacity: true, price: true }
    });

    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.organizerId === userId) return res.status(400).json({ message: "Organizers are pre-registered" });

    if (req.method === "POST") {
      const activeCount = await prismadb.attendance.count({
        where: { eventId, status: { in: ["REGISTERED", "CONFIRMED"] } }
      });

      if (activeCount >= event.capacity) return res.status(409).json({ message: "Sold out" });

      const attendance = await prismadb.attendance.upsert({
        where: { userId_eventId: { userId, eventId } },
        update: { status: "REGISTERED" },
        create: { userId, eventId, status: "REGISTERED" }
      });

      // Handle Free Ticket Auto-Generation
      if (!event.price || event.price <= 0) {
        const ticket = await prismadb.ticket.create({
          data: {
            ticketNumber: generateTicketNumber(),
            userId,
            eventId,
            status: "ACTIVE"
          }
        });
        const qrCode = await generateQRCode(ticket.id, eventId);
        await prismadb.ticket.update({ where: { id: ticket.id }, data: { qrCode } });
      }

      return res.status(201).json({ attendance });
    }

    if (req.method === "DELETE") {
      await prismadb.attendance.delete({ where: { userId_eventId: { userId, eventId } } });
      return res.status(200).json({ message: "Unregistered" });
    }

    return res.status(405).end();
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
}