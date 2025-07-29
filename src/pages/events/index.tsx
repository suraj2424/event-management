import { GetServerSideProps } from 'next';
import EventsClient from '@/components/events/EventsClient';
import { Event, EventType } from '@/types/events';
import { Skeleton } from '@/components/ui/skeleton';

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

// Loading component
function EventsPageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Skeleton className="h-10 w-80" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Filters Skeleton */}
        <div className="mb-8">
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
        </div>

        {/* Events Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ query }) => {
  // Parse query parameters with proper defaults and validation
  const page = Math.max(1, parseInt(query.page as string || '1'));
  const eventType = (['all', 'upcoming', 'ongoing', 'past'].includes(query.type as string)) 
    ? (query.type as EventType) 
    : 'all';
  const limit = Math.min(50, Math.max(1, parseInt(query.limit as string || '2')));
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

    // Determine API URL based on environment
    const getApiUrl = () => {
      if (process.env.NODE_ENV === 'development') {
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      }
      return process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
    };

    const apiUrl = getApiUrl();
    
    if (!apiUrl) {
      throw new Error('API URL is not configured');
    }

    const response = await fetch(
      `${apiUrl}/api/events?${queryParams.toString()}`,
      { 
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'EventsPage/1.0',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000), // 10 second timeout
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
  // Show loading skeleton while client-side navigation is happening
  if (typeof window !== 'undefined' && !events && !error) {
    return <EventsPageSkeleton />;
  }

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

// Optional: Add custom error page
export function getServerSidePropsError() {
  return {
    props: {
      events: [],
      totalPages: 1,
      error: 'An unexpected error occurred while loading the page.',
      page: 1,
      eventType: 'all' as EventType,
      searchTerm: '',
    },
  };
}