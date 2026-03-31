import { GetServerSideProps } from 'next';
import EventsClient from '@/components/events/EventsClient';
import { Event, EventType } from '@/types/events';
import prismadb from '@/providers/prismaclient';
import { buildEventFilter, getEventStatus } from '@/lib/event-filters';

interface PageProps {
  events: Event[];
  totalPages: number;
  error: string | null;
  page: number;
  eventType: EventType;
  searchTerm: string;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ query }) => {
  const page = Math.max(1, parseInt(query.page as string || '1'));
  const eventType = (['all', 'upcoming', 'ongoing', 'past'].includes(query.type as string)) 
    ? (query.type as EventType) 
    : 'all';
  const limit = Math.min(50, Math.max(1, parseInt(query.limit as string || '9')));
  const searchTerm = (query.search as string || '').trim();
  const skip = (page - 1) * limit;

  try {
    const filter = buildEventFilter(eventType, searchTerm);

    const [prismaEvents, totalEvents] = await Promise.all([
      prismadb.event.findMany({
        where: filter,
        skip,
        take: limit,
        orderBy: { startDate: 'asc' },
      }),
      prismadb.event.count({ where: filter })
    ]);

    const totalPages = Math.max(1, Math.ceil(totalEvents / limit));

    // Fix: Date serialization for Next.js SSR
    const events = prismaEvents.map((event) => ({
      ...event,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      status: getEventStatus(event.startDate, event.endDate),
    })) as unknown as Event[];

    if (page > totalPages && totalEvents > 0) {
      return { redirect: { 
        destination: `/events?type=${eventType}&page=${totalPages}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`, 
        permanent: false 
      }};
    }

    return { props: { events, totalPages, error: null, page, eventType, searchTerm }};
  } catch (err) {
    return { props: { events: [], totalPages: 1, error: "Failed to load events", page, eventType, searchTerm }};
  }
};

export default function EventsPage(props: PageProps) {
  return <EventsClient 
    initialEvents={props.events} 
    initialTotalPages={props.totalPages} 
    initialError={props.error}
    initialPage={props.page}
    initialEventType={props.eventType}
    initialSearchTerm={props.searchTerm}
  />;
}