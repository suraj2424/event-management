import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prismadb from '@/providers/prismaclient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'You must be signed in to access this endpoint'
      });
    }

    const { id } = req.query;
    const eventId = Number(id);
    
    if (isNaN(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await prismadb.event.findUnique({
      where: { id: eventId },
      select: { organizerId: true }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizerId === session.user.id) {
      return res.status(400).json({ 
        message: 'Event creator is automatically registered',
        isRegistered: true
      });
    }

    switch (req.method) {
      case 'GET': {
        const attendance = await prismadb.attendance.findUnique({
          where: {
            userId_eventId: {
              userId: session.user.id,
              eventId: eventId,
            },
          },
        });
    
        return res.status(200).json({
          isRegistered: !!attendance,
          attendance: attendance
        });
      }

      case 'POST': {
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
            message: 'Already registered for this event',
            attendance: existingAttendance
          });
        }
    
        const attendance = await prismadb.attendance.create({
          data: {
            userId: session.user.id,
            eventId: eventId,
            status: 'REGISTERED'
          },
        });
    
        return res.status(201).json({
          message: 'Successfully registered for event',
          attendance: attendance
        });
      }

      case 'DELETE': {
        const attendance = await prismadb.attendance.delete({
          where: {
            userId_eventId: {
              userId: session.user.id,
              eventId: eventId,
            },
          },
        }).catch(() => null);

        if (!attendance) {
          return res.status(404).json({ 
            message: 'Not registered for this event'
          });
        }

        return res.status(200).json({
          message: 'Successfully unregistered from event',
          attendance: attendance
        });
      }

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    });
  }
}