// pages/api/events/[id]/details.ts

import prismadb from '@/providers/prismaclient';
import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  try {
    const eventDetails = await prismadb.event.findUnique({
      where: { id: parseInt(id) },
      select: {
        specialGuests: {
          select: {
            id: true,
            guestName: true,
            guestDescription: true,
          },
        },
        socialLinks: {
          select: {
            facebook: true,
            twitter: true,
            instagram: true,
          },
        },
      },
    });

    if (!eventDetails) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json(eventDetails);
  } catch (error) {
    console.error('Error fetching event details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prismadb.$disconnect();
  }
}