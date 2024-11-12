import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prismadb from '@/providers/prismaclient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the session using getServerSession instead of getSession
    const session = await getServerSession(req, res, authOptions);

    // Check if the user is authenticated
    if (!session || !session.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'You must be signed in to access this endpoint'
      });
    }

    const { id } = req.query;

    // Validate the event ID
    const eventId = Number(id);
    if (isNaN(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    // Handle GET request
    if (req.method === 'GET') {
      const attendance = await prismadb.attendance.findUnique({
        where: {
          userId_eventId: {
            userId: session.user.id,
            eventId: eventId,
          },
        },
      });

      if (!attendance) {
        return res.status(404).json({ 
          message: 'No attendance record found',
          status: null 
        });
      }

      return res.status(200).json(attendance);
    }

    // Handle POST request
    if (req.method === 'POST') {
      // Check if event exists
      const event = await prismadb.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Check for existing attendance
      const existingAttendance = await prismadb.attendance.findUnique({
        where: {
          userId_eventId: {
            userId: session.user.id,
            eventId: eventId,
          },
        },
      });

      if (existingAttendance) {
        return res.status(400).json({ 
          message: 'Already registered',
          attendance: existingAttendance
        });
      }

      // Create new attendance record
      const newAttendance = await prismadb.attendance.create({
        data: {
          userId: session.user.id,
          eventId: eventId,
          status: 'REGISTERED',
        },
      });

      return res.status(201).json(newAttendance);
    }

    // Handle invalid methods
    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}