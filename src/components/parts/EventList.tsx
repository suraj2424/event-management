import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: number;

  title?: string;

  startDate?: string;

  endDate?: string;

  logo?: string;

  location?: string;

  description?: string;

  capacity?: number;

  status?: string;

  organizer?: string;
}

interface EventListProps {
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  const router = useRouter();

  useEffect(() => {
    events.forEach((event) => {
      router.prefetch(`/events/${event.id}`);
    });
  }, [events, router]);

  const handleCardClick = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card
          key={event.id}
          className="overflow-hidden relative cursor-pointer"
          onClick={() => handleCardClick(event.id)}
        >
          {event.logo && (
            <div className="relative h-48 w-full mb-4">
              <Image
                src={event.logo}
                alt={`${event.title} logo`}
                fill
                draggable={false}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                style={{ objectFit: "cover" }}
              />
              <div className="absolute top-2 right-2">
                <Badge
                  className={`${
                    event.status === "ONGOING"
                      ? "bg-green-600"
                      : event.status === "UPCOMING"
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  } text-white uppercase px-3 py-1`}
                >
                  {event.status}
                </Badge>
              </div>
            </div>
          )}
          <CardContent className="space-y-2">
            <CardHeader className="p-0">
              <CardTitle className="text-xl">{event.title}</CardTitle>
            </CardHeader>
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>
                {event.startDate
                  ? format(new Date(event.startDate), "PPP")
                  : "TBA"}{" "}
                -{" "}
                {event.endDate ? format(new Date(event.endDate), "PPP") : "TBA"}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{event.capacity} capacity</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EventList;
