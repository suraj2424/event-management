import { GetServerSideProps } from 'next';
import EventsClient from '@/components/events/EventsClient';
import { Event, EventType } from '@/types/events';

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
    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      type: eventType,
    });

    if (searchTerm) {
      queryParams.append('search', searchTerm);
    }

    // Dynamic URL based on environment
    const getBaseUrl = () => {
      // Production - use VERCEL_URL or custom domain
      if (process.env.NEXT_PUBLIC_API_URL) {
        return `${process.env.NEXT_PUBLIC_API_URL}`;
      }
      
      // Custom production URL
      if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
      }
      
      // Development fallback
      return 'http://localhost:3000';
    };

    const baseUrl = getBaseUrl();

    const response = await fetch(
      `${baseUrl}/api/events?${queryParams.toString()}`,
      { 
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'EventsPage/1.0',
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format: Expected JSON');
    }

    const data: ApiResponse = await response.json();

    // Validate the response data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response: Response is not an object');
    }

    if (!Array.isArray(data.events)) {
      console.warn('Invalid events data, using empty array');
      events = [];
    } else {
      events = data.events;
    }

    if (typeof data.totalPages === 'number' && data.totalPages > 0) {
      totalPages = data.totalPages;
    } else {
      totalPages = Math.max(1, Math.ceil(events.length / limit));
    }

    // Validate that current page doesn't exceed total pages
    if (page > totalPages && totalPages > 0) {
      return {
        redirect: {
          destination: `/events?type=${eventType}&page=${totalPages}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`,
          permanent: false,
        },
      };
    }

  } catch (err) {
    console.error('Error fetching events:', err);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to load events. Please try again later.';
    
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (err.message.includes('fetch')) {
        errorMessage = 'Unable to connect to the server. Please try again later.';
      } else {
        errorMessage = err.message;
      }
    }

    error = errorMessage;
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