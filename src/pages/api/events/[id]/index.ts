import { eventRedis } from "@/lib/redis";
import prismadb from "@/providers/prismaclient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // Check for invalid ID format
  if (!id || Array.isArray(id)) {
    res.status(400).json({ message: "Invalid event ID" });
    return;
  }

  try {
    const cachedEvent = await eventRedis.getCachedEvent(id);
    if (cachedEvent) {
      return res.status(200).json(cachedEvent);
    }

    // Fetch the event from the database using Prisma
    const event = await prismadb.event.findUnique({
      where: { id: Number(id) }, // Ensure id is a number
      include: {
        organizer: true, // Include related data if needed (e.g., organizer)
      },
    });

    // After database query

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    await eventRedis.cacheEvent(id, event);


    // Return the event data as JSON
    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
