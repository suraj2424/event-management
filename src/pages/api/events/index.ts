import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prismadb from '@/providers/prismaclient';
import { AttendanceStatus } from '@prisma/client';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as AttendanceStatus | undefined;
    const eventType = req.query.type as 'all' | 'upcoming' | 'ongoing' | 'past' | undefined;
    const currentDate = new Date();

    let dateFilter = {};
    if (eventType === 'upcoming') {
      dateFilter = { startDate: { gt: currentDate } };
    } else if (eventType === 'ongoing') {
      dateFilter = { 
        AND: [
          { startDate: { lte: currentDate } },
          { endDate: { gte: currentDate } }
        ]
      };
    } else if (eventType === 'past') {
      dateFilter = { endDate: { lt: currentDate } };
    }

    const filter: any = {
      ...dateFilter
    };

    // Get events with related data
    const events = await prismadb.event.findMany({
      where: filter,
      orderBy: { startDate: 'desc' },
      take: limit,
      skip: skip,
      include: {
        organizer: true,
        specialGuests: true,
        socialLinks: true,
        attendance: true,
      }
    });

    // Add event status based on dates
    const eventsWithStatus = events.map(event => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      let eventStatus: 'UPCOMING' | 'ONGOING' | 'PAST';

      if (currentDate > endDate) {
        eventStatus = 'PAST';
      } else if (currentDate >= startDate && currentDate <= endDate) {
        eventStatus = 'ONGOING';
      } else {
        eventStatus = 'UPCOMING';
      }

      return {
        ...event,
        status: eventStatus
      };
    });

    // Get total count for pagination
    const totalEvents = await prismadb.event.count({
      where: filter
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalEvents / limit);

    return res.status(200).json({
      events: eventsWithStatus,
      pagination: {
        currentPage: page,
        totalPages,
        totalEvents,
        limit
      }
    });
  } catch (error) {
    console.error('Events fetch error:', error);
    return res.status(500).json({ 
      error: 'Error fetching events',
      details: (error as Error).message 
    });
  }
});

router.post(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { eventId, status } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    // Check if event exists
    const event = await prismadb.event.findUnique({
      where: { id: parseInt(eventId) }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Create or update attendance
    const attendance = await prismadb.attendance.upsert({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: parseInt(eventId)
        }
      },
      update: {
        status: status || 'REGISTERED'
      },
      create: {
        userId: session.user.id,
        eventId: parseInt(eventId),
        status: status || 'REGISTERED'
      },
      include: {
        event: true
      }
    });

    return res.status(201).json(attendance);
  } catch (error) {
    console.error('Attendance creation error:', error);
    return res.status(500).json({ 
      error: 'Error creating attendance',
      details: (error as Error).message 
    });
  }
});

router.delete(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const eventId = req.query.eventId as string;

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    // Verify attendance exists and belongs to user
    const attendance = await prismadb.attendance.findFirst({
      where: {
        eventId: parseInt(eventId),
        userId: session.user.id
      }
    });

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Delete attendance
    await prismadb.attendance.delete({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: parseInt(eventId)
        }
      }
    });

    return res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Attendance deletion error:', error);
    return res.status(500).json({ 
      error: 'Error deleting attendance',
      details: (error as Error).message 
    });
  }
});

export default router.handler();