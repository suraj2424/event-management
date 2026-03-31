import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { AlertTriangle, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import EventDetailClient from "@/components/events/id/EventDetailClient";
import prisma from "@/providers/prismaclient";
import { getEventStatus } from "@/lib/event-filters";
import { EventPageProps } from "@/types/events";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EventDetailPage({
  event,
  attendance,
  error,
  isAuthenticated,
}: EventPageProps) {
  if (error) return <ErrorState error={error} />;
  if (!event) return <NotFoundState />;

  return (
    <EventDetailClient
      event={event}
      attendance={attendance}
      isAuthenticated={isAuthenticated}
    />
  );
}

export const getServerSideProps: GetServerSideProps<EventPageProps> = async ({ params, req, res }) => {
  const eventId = params?.id as string;
  const idNum = parseInt(eventId);

  if (isNaN(idNum)) return { notFound: true };

  try {
    const session = await getServerSession(req, res, authOptions);
    
    const eventRecord = await prisma.event.findUnique({
      where: { id: idNum },
      include: {
        // Removed 'image' as it doesn't exist in your User model
        organizer: { select: { id: true, name: true, email: true } },
        specialGuests: { select: { id: true, guestName: true, guestDescription: true } },
        socialLinks: { select: { facebook: true, twitter: true, instagram: true } },
      },
    });

    if (!eventRecord) return { notFound: true };

    let attendanceData = null;
    if (session?.user) {
      const att = await prisma.attendance.findUnique({
        where: { userId_eventId: { userId: session.user.id, eventId: idNum } },
        select: { status: true },
      });
      attendanceData = { isRegistered: !!att, status: att?.status ?? null };
    }

    // Clean serialization for Next.js
    const eventData = {
      ...eventRecord,
      id: String(eventRecord.id),
      startDate: eventRecord.startDate.toISOString(),
      endDate: eventRecord.endDate.toISOString(),
      // Use your helper for the status string
      status: getEventStatus(eventRecord.startDate, eventRecord.endDate),
      price: eventRecord.price || 0,
    };

    return {
      props: {
        event: eventData as any,
        attendance: attendanceData,
        eventId,
        error: null,
        isAuthenticated: !!session,
      },
    };
  } catch (err: any) {
    return { props: { event: null, attendance: null, eventId, error: err.message, isAuthenticated: false }};
  }
};


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