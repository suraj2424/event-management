// components/events/id/EventHost.tsx
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { User } from 'lucide-react';
import { Event } from './types';

interface EventHostProps {
  event: Event;
}

const EventHost: React.FC<EventHostProps> = ({ event }) => {
  return (
    <Card className="mb-8 border-0 bg-muted/20 event-host">
      <CardContent className="p-6">
        
      </CardContent>

      <style jsx>{`
        .event-host {
          animation: slideUp 0.8s ease-out 1s both;
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

export default EventHost;