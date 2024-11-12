import prismadb from '@/providers/prismaclient'; // Ensure this is the correct import path for your Prisma client
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Check for invalid ID format
  if (!id || Array.isArray(id)) {
    res.status(400).json({ message: 'Invalid event ID' });
    return;
  }

  try {
    // Fetch the event from the database using Prisma
    const event = await prismadb.event.findUnique({
        where: { id: Number(id) },  // Ensure id is a number
      include: {
        organizer: true,  // Include related data if needed (e.g., organizer)
      },
    });

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Return the event data as JSON
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
