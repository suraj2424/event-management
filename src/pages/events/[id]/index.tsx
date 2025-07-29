import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Calendar } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import EventDetailClient from "@/components/events/id/EventDetailClient";

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

interface SpecialGuest {
  id: number;
  guestName: string;
  guestDescription: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  logo: string;
  location: string;
  capacity: number;
  status: string;
  photos: string[];
  contactEmail: string;
  contactPhone: string;
  hostName: string;
  hostDescription: string;
  organizer: { name: string; email: string };
}

interface EventDetails {
  specialGuests: SpecialGuest[];
  socialLinks: SocialLinks;
}

interface Attendance {
  status: string | null;
  isRegistered: boolean;
}

interface SerializableSession {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: "ADMIN" | "ORGANIZER" | "ATTENDEE";
  };
  expires: string;
}

interface EventPageProps {
  event: Event | null;
  eventDetails: EventDetails | null;
  attendance: Attendance | null;
  eventId: string;
  error: string | null;
  isAuthenticated: boolean;
  session: SerializableSession | null;
}

// Server function to fetch event data
async function fetchEventData(eventId: string): Promise<Event | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    `http://localhost:${process.env.PORT || 3000}`;

  const response = await fetch(`${baseUrl}/api/events/${eventId}`, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Event API error: ${response.status}`);
  }

  return response.json();
}

// Server function to fetch event details
async function fetchEventDetails(eventId: string): Promise<EventDetails | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    `http://localhost:${process.env.PORT || 3000}`;

  const response = await fetch(`${baseUrl}/api/events/${eventId}/details`, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Event details API error: ${response.status}`);
  }

  return response.json();
}

// Server function to fetch attendance data
async function fetchAttendanceData(eventId: string, cookie: string): Promise<Attendance | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    `http://localhost:${process.env.PORT || 3000}`;

  try {
    const response = await fetch(`${baseUrl}/api/events/${eventId}/attendance`, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Cookie: cookie,
      },
    });

    if (response.ok) {
      const attendance = await response.json();
      return {
        isRegistered: attendance.isRegistered,
        status: attendance.attendance?.status || null,
      };
    } else if (response.status === 404) {
      return { isRegistered: false, status: null };
    } else {
      console.error("Failed to fetch attendance status:", response.statusText);
      return { isRegistered: false, status: null };
    }
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return { isRegistered: false, status: null };
  }
}

// Error State Component
const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <Card className="w-full max-w-md border-destructive/20 bg-destructive/5">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Error Loading Event
        </h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">{error}</p>
        <Button asChild variant="outline">
          <Link href="/events">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </Button>
      </CardContent>
    </Card>
  </div>
);

// Not Found State Component
const NotFoundState: React.FC = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Event Not Found
        </h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          The requested event could not be found. It may have been removed or
          the link is incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="outline">
            <Link href="/events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse Events
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function EventDetailPage({
  event,
  eventDetails,
  attendance,
  eventId,
  error,
  isAuthenticated,
}: EventPageProps) {
  if (error) {
    return <ErrorState error={error} />;
  }

  if (!event || !eventDetails) {
    return <NotFoundState />;
  }

  return (
    <EventDetailClient
      event={event}
      eventDetails={eventDetails}
      attendance={attendance}
      eventId={eventId}
      isAuthenticated={isAuthenticated}
    />
  );
}

export const getServerSideProps: GetServerSideProps<EventPageProps> = async ({
  params,
  req,
  res,
}) => {
  const eventId = params?.id as string;

  if (!eventId) {
    return {
      notFound: true,
    };
  }

  try {
    // Get user session
    const session: Session | null = await getServerSession(req, res, authOptions);
    const isAuthenticated = !!session;

    // Fetch event and event details using server functions
    const [eventData, detailsData] = await Promise.all([
      fetchEventData(eventId),
      fetchEventDetails(eventId),
    ]);

    if (!eventData || !detailsData) {
      return { notFound: true };
    }

    // Fetch attendance data if user is authenticated
    let attendanceData: Attendance | null = null;
    if (session?.user) {
      attendanceData = await fetchAttendanceData(eventId, req.headers.cookie || "");
    }

    // Create serializable session object
    const serializableSession: SerializableSession | null = session
      ? {
          user: {
            id: session.user.id,
            name: session.user.name || null,
            email: session.user.email || null,
            image: session.user.image || null,
            role: session.user.role,
          },
          expires: session.expires,
        }
      : null;

    return {
      props: {
        event: eventData,
        eventDetails: detailsData,
        attendance: attendanceData,
        eventId,
        error: null,
        isAuthenticated,
        session: serializableSession,
      },
    };
  } catch (error) {
    console.error("Error fetching event data:", error);

    return {
      props: {
        event: null,
        eventDetails: null,
        attendance: null,
        eventId,
        error:
          error instanceof Error ? error.message : "Failed to load event data",
        isAuthenticated: false,
        session: null,
      },
    };
  }
};