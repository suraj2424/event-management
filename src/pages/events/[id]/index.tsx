import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Calendar } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import EventDetailClient from "@/components/events/id/EventDetailClient";
import { prismadb } from "@/providers/prismaclient";

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

// Database function to fetch event data
async function getEventFromDatabase(eventId: string): Promise<Event | null> {
  try {
    const event = await prismadb.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: {
          select: { 
            name: true, 
            email: true 
          }
        }
      }
    });
    
    if (!event) return null;
    
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      logo: event.logo,
      location: event.location,
      capacity: event.capacity,
      status: event.status,
      photos: event.photos,
      contactEmail: event.contactEmail,
      contactPhone: event.contactPhone,
      hostName: event.hostName,
      hostDescription: event.hostDescription,
      organizer: {
        name: event.organizer.name || "",
        email: event.organizer.email
      }
    };
  } catch (error) {
    console.error("Database error fetching event:", error);
    return null;
  }
}

// Database function to fetch event details
async function getEventDetailsFromDatabase(eventId: string): Promise<EventDetails | null> {
  try {
    // Fetch special guests
    const specialGuests = await prismadb.specialGuest.findMany({
      where: { eventId },
      select: {
        id: true,
        guestName: true,
        guestDescription: true
      }
    });

    // Fetch social links (assuming they're stored in a separate table or in the event table)
    const socialLinksData = await prismadb.event.findUnique({
      where: { id: eventId },
      select: {
        socialLinks: true // Assuming this is a JSON field
      }
    });
    
    return {
      specialGuests: specialGuests.map(guest => ({
        id: guest.id,
        guestName: guest.guestName,
        guestDescription: guest.guestDescription
      })),
      socialLinks: (socialLinksData?.socialLinks as SocialLinks) || {}
    };
  } catch (error) {
    console.error("Database error fetching event details:", error);
    return null;
  }
}

// Database function to fetch attendance data
async function getAttendanceFromDatabase(eventId: string, userId: string): Promise<Attendance | null> {
  try {
    const registration = await prismadb.eventRegistration.findFirst({
      where: {
        eventId,
        userId
      },
      select: {
        status: true
      }
    });
    
    return {
      isRegistered: !!registration,
      status: registration?.status || null
    };
  } catch (error) {
    console.error("Database error fetching attendance:", error);
    return { 
      isRegistered: false, 
      status: null 
    };
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

    // Fetch event and event details using database functions
    const [eventData, detailsData] = await Promise.all([
      getEventFromDatabase(eventId),
      getEventDetailsFromDatabase(eventId),
    ]);

    if (!eventData || !detailsData) {
      return { notFound: true };
    }

    // Fetch attendance data if user is authenticated
    let attendanceData: Attendance | null = null;
    if (session?.user?.id) {
      attendanceData = await getAttendanceFromDatabase(eventId, session.user.id);
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