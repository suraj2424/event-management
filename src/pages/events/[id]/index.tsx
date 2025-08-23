import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Calendar } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import EventDetailClient from "@/components/events/id/EventDetailClient";
import prisma from "@/providers/prismaclient";

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

    const idNum = Number(eventId);
    if (Number.isNaN(idNum)) {
      return { notFound: true };
    }

    // Single DB call for event core + details
    const eventRecord = await prisma.event.findUnique({
      where: { id: idNum },
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        logo: true,
        location: true,
        capacity: true,
        photos: true,
        contactEmail: true,
        contactPhone: true,
        hostName: true,
        hostDescription: true,
        organizer: { select: { name: true, email: true } },
        specialGuests: { select: { id: true, guestName: true, guestDescription: true } },
        socialLinks: { select: { facebook: true, twitter: true, instagram: true } },
      },
    });

    if (!eventRecord) {
      return { notFound: true };
    }

    // Compute status and serialize dates
    const now = new Date();
    const start = new Date(eventRecord.startDate as any);
    const end = new Date(eventRecord.endDate as any);
    let status: 'UPCOMING' | 'ONGOING' | 'PAST' = 'UPCOMING';
    if (now > end) status = 'PAST';
    else if (now >= start && now <= end) status = 'ONGOING';

    const eventData: Event = {
      id: String(eventRecord.id),
      title: eventRecord.title,
      description: eventRecord.description,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      logo: eventRecord.logo,
      location: eventRecord.location,
      capacity: eventRecord.capacity,
      status,
      photos: (eventRecord.photos as unknown as string[]) || [],
      contactEmail: eventRecord.contactEmail,
      contactPhone: eventRecord.contactPhone,
      hostName: eventRecord.hostName,
      hostDescription: eventRecord.hostDescription,
      organizer: {
        name: eventRecord.organizer?.name || '',
        email: eventRecord.organizer?.email || '',
      },
    };

    const detailsData: EventDetails = {
      specialGuests: (eventRecord.specialGuests as any) ?? [],
      socialLinks: {
        facebook: eventRecord.socialLinks?.facebook ?? undefined,
        twitter: eventRecord.socialLinks?.twitter ?? undefined,
        instagram: eventRecord.socialLinks?.instagram ?? undefined,
      },
    };

    // Attendance direct query (authenticated only)
    let attendanceData: Attendance | null = null;
    if (session?.user) {
      const att = await prisma.attendance.findUnique({
        where: { userId_eventId: { userId: session.user.id, eventId: idNum } },
        select: { status: true },
      });
      attendanceData = { isRegistered: !!att, status: att?.status ?? null };
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