import { GetServerSideProps } from 'next';
import EventsClient from '@/components/events/EventsClient';
import { Event, EventType } from '@/types/events';
import prismadb from '@/providers/prismaclient';

interface ApiResponse {
  events: Event[];
  currentPage: number;
  totalPages: number;
  totalEvents: number;
}

interface PageProps {
  events: Event[];
  totalPages: number;
  error: string | null;
  page: number;
  eventType: EventType;
  searchTerm: string;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ query }) => {
  // Parse query parameters with proper defaults and validation
  const page = Math.max(1, parseInt(query.page as string || '1'));
  const eventType = (['all', 'upcoming', 'ongoing', 'past'].includes(query.type as string)) 
    ? (query.type as EventType) 
    : 'all';
  const limit = Math.min(50, Math.max(1, parseInt(query.limit as string || '9')));

  const searchTerm = (query.search as string || '').trim();

  let events: Event[] = [];
  let totalPages = 1;
  let error: string | null = null;

  try {
    const currentDate = new Date();

    // Build Prisma filter mirroring API logic
    let filter:
      | { AND?: Array<{ startDate?: { lte: Date }; endDate?: { gte: Date } }>; OR?: any[] }
      | { startDate?: { gt: Date }; OR?: any[] }
      | { endDate?: { lt: Date }; OR?: any[] }
      | { OR?: any[] } = {};

    switch (eventType) {
      case 'upcoming':
        filter = { startDate: { gt: currentDate } };
        break;
      case 'ongoing':
        filter = { AND: [{ startDate: { lte: currentDate } }, { endDate: { gte: currentDate } }] };
        break;
      case 'past':
        filter = { endDate: { lt: currentDate } };
        break;
      // 'all' => no filter
    }

    if (searchTerm) {
      const or = [
        { title: { contains: searchTerm, mode: 'insensitive' as const } },
        { description: { contains: searchTerm, mode: 'insensitive' as const } },
        { location: { contains: searchTerm, mode: 'insensitive' as const } },
        { hostName: { contains: searchTerm, mode: 'insensitive' as const } },
      ];
      if ('AND' in filter || 'startDate' in filter || 'endDate' in filter) {
        (filter as any).OR = or;
      } else {
        filter = { OR: or };
      }
    }

    const skip = (page - 1) * limit;

    const prismaEvents = await prismadb.event.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: { startDate: 'asc' },
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
        socialLinksId: true,
        organizerId: true,
      },
    });

    // Add status field to match API response shape consumed by UI
    const eventsWithStatus = prismaEvents.map((event) => {
      let status: 'UPCOMING' | 'ONGOING' | 'PAST' = 'UPCOMING';
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      if (currentDate > endDate) status = 'PAST';
      else if (currentDate >= startDate && currentDate <= endDate) status = 'ONGOING';
      return {
        ...event,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status,
      } as unknown as Event;
    });

    const totalEvents = await prismadb.event.count({ where: filter });
    totalPages = Math.max(1, Math.ceil(totalEvents / limit));
    events = eventsWithStatus;

    if (page > totalPages && totalPages > 0) {
      return {
        redirect: {
          destination: `/events?type=${eventType}&page=${totalPages}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`,
          permanent: false,
        },
      };
    }
  } catch (err) {
    console.error('Error fetching events (SSR):', err);
    error = err instanceof Error ? err.message : 'Failed to load events. Please try again later.';
  }

  return {
    props: {
      events,
      totalPages,
      error,
      page,
      eventType,
      searchTerm,
    },
  };
};

export default function EventsPage({ 
  events, 
  totalPages, 
  error, 
  page, 
  eventType, 
  searchTerm 
}: PageProps) {
  return (
    <EventsClient 
      initialEvents={events} 
      initialTotalPages={totalPages} 
      initialError={error}
      initialPage={page}
      initialEventType={eventType}
      initialSearchTerm={searchTerm}
    />
  );
}