// components/events/id/EventDescription.tsx
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Event } from './types';

interface EventDescriptionProps {
  event: Event;
}

const EventDescription: React.FC<EventDescriptionProps> = ({ event }) => {
  if (!event.description) return null;

  return (
    <Card className="mb-8 border-0 bg-background event-description">
      <CardContent className="p-6">
        
      </CardContent>

      <style jsx>{`
        .event-description {
          animation: slideUp 0.8s ease-out 0.6s both;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Card>
  );
};

export default EventDescription;