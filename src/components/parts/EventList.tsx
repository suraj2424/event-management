// components/parts/EventList.tsx
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  logo: string;
  photos: string[];
  contactEmail: string;
  contactPhone: string;
  hostName: string;
  hostDescription: string;
  socialLinksId: number;
  organizerId: string;
  organizer: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  status: 'UPCOMING' | 'ONGOING' | 'PAST';
}

interface EventListProps {
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  const router = useRouter();

  useEffect(() => {
    // Prefetch event detail pages for better performance
    events.forEach((event) => {
      router.prefetch(`/events/${event.id}`);
    });
  }, [events, router]);

  const handleCardClick = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "MMM dd, yyyy") : "TBA";
    } catch {
      return "TBA";
    }
  };

  const formatTime = (dateString: string): string => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "h:mm a") : "";
    } catch {
      return "";
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'ONGOING':
        return 'default';
      case 'UPCOMING':
        return 'secondary';
      case 'PAST':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ONGOING':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'UPCOMING':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'PAST':
        return 'text-muted-foreground bg-muted border-muted';
      default:
        return 'text-muted-foreground bg-muted border-muted';
    }
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (!events || events.length === 0) {
    return (
      <div className="w-full text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 text-muted-foreground/40">
          <Calendar className="w-full h-full" />
        </div>
        <p className="text-muted-foreground">No events to display</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {events.map((event, index) => (
          <Card
            key={event.id}
            className="group overflow-hidden border-0 bg-background hover:shadow-lg transition-all duration-500 cursor-pointer hover:-translate-y-1 event-card"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => handleCardClick(event.id)}
          >
            {/* Event Image */}
            <div className="relative h-48 w-full overflow-hidden bg-muted/30">
              {event.logo ? (
                <Image
                  src={event.logo}
                  alt={`${event.title} event image`}
                  fill
                  draggable={false}
                  sizes="(max-width: 768px) 70vw, (max-width: 1200px) 40vw, 26vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-muted/30 to-muted/60 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-muted-foreground/60" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <Badge 
                  variant={getStatusVariant(event.status)}
                  className={`shadow-sm font-medium px-3 py-1 ${getStatusColor(event.status)}`}
                >
                  {event.status === 'ONGOING' && <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />}
                  {event.status.charAt(0) + event.status.slice(1).toLowerCase()}
                </Badge>
              </div>

              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Card Content */}
            <CardContent className="p-6 space-y-4">
              {/* Title */}
              <div>
                <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors leading-tight">
                  {truncateText(event.title, 60)}
                </h3>
                {event.hostName && (
                  <p className="text-sm text-muted-foreground mt-1">
                    by {event.hostName}
                  </p>
                )}
              </div>

              {/* Event Details */}
              <div className="space-y-3">
                {/* Date and Time */}
                <div className="flex justify-between items-center"><div className="flex items-start gap-3 text-xs">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-foreground">
                      {formatDate(event.startDate)}
                    </span>
                    {formatTime(event.startDate) && (
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(event.startDate)}
                      </span>
                    )}
                  </div>
                </div>
                {/* Capacity */}
                {event.capacity && (
                  <div className="flex items-center gap-3 text-xs">
                    <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">
                      Up to {event.capacity.toLocaleString()} attendees
                    </span>
                  </div>
                )}
                </div>
                

                {/* Location */}
                <div className="flex items-center gap-3 text-xs">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground truncate" title={event.location}>
                    {event.location || 'Location TBA'}
                  </span>
                </div>

              </div>

              {/* Action Button */}
              <Button 
                variant="outline"
                className="w-full group/btn hover:bg-muted transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(event.id);
                }}
              >
                <span className="mr-2">
                  {event.status === 'PAST' ? 'View Details' : 'Learn More'}
                </span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <style jsx>{`

        .event-card {
          animation: slideUp 0.6s ease-out both;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default EventList;