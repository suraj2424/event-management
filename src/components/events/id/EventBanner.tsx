// components/events/id/EventBanner.tsx
import React from 'react';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { Event } from './types'; // Assuming 'types.ts' is where your Event interface is defined
import { format, isBefore, isAfter, isEqual } from 'date-fns';

interface EventBannerProps {
  event: Event;
}

const EventBanner: React.FC<EventBannerProps> = ({ event }) => {

  const getEventStatus = (startDateStr: string, endDateStr: string): 'ONGOING' | 'UPCOMING' | 'PAST' => {
    const now = new Date();
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // To account for events that start and end on the same day, consider the entire day.
    // Set start of day for startDate and end of day for endDate.
    const startOfDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endOfDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999);

    if (isAfter(now, endOfDay)) {
      return 'PAST';
    } else if (isBefore(now, startOfDay)) {
      return 'UPCOMING';
    } else if (isAfter(now, startOfDay) || isEqual(now, startOfDay) && isBefore(now, endOfDay) || isEqual(now, endOfDay)) {
      return 'ONGOING';
    }
    return 'PAST'; // Default or fallback, though the above logic should cover all cases.
  };

  const currentStatus = getEventStatus(event.startDate, event.endDate);

  const getStatusVariant = (status: 'ONGOING' | 'UPCOMING' | 'PAST') => {
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

  const getStatusColor = (status: 'ONGOING' | 'UPCOMING' | 'PAST'): string => {
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

  // Format dates for display
  const formattedStartDate = format(new Date(event.startDate), 'MMM dd, yyyy');
  const formattedEndDate = format(new Date(event.endDate), 'MMM dd, yyyy');

  if (!event.logo) {
    return (
      <div className="mb-8 event-banner">
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {event.title}
          </h1>
          <p className="text-muted-foreground mb-4">
            {formattedStartDate} - {formattedEndDate}
          </p>
          <Badge
            variant={getStatusVariant(currentStatus)}
            className={`${getStatusColor(currentStatus)} font-medium px-4 py-2`}
          >
            {currentStatus === 'ONGOING' && <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />}
            {currentStatus.charAt(0) + currentStatus.slice(1).toLowerCase()}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 event-banner">
      <div className="relative h-80 w-full rounded-lg overflow-hidden">
        <Image
          src={event.logo}
          alt={`${event.title} banner`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
          priority
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {event.title}
          </h1>
          <p className="text-white/80 text-lg mb-2">
            {formattedStartDate} - {formattedEndDate}
          </p>
          <Badge
            variant={getStatusVariant(currentStatus)}
            className={`${getStatusColor(currentStatus)} font-medium px-4 py-2`}
          >
            {currentStatus === 'ONGOING' && <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />}
            {currentStatus.charAt(0) + currentStatus.slice(1).toLowerCase()}
          </Badge>
        </div>
      </div>

      <style jsx>{`
        .event-banner {
          animation: slideUp 0.8s ease-out 0.2s both;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default EventBanner;