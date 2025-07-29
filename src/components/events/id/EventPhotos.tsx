// components/events/id/EventPhotos.tsx
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Event } from './types';

interface EventPhotosProps {
  event: Event;
  onPhotoClick: (photo: string) => void;
}

const EventPhotos: React.FC<EventPhotosProps> = ({ event, onPhotoClick }) => {
  if (!event.photos || event.photos.length === 0) return null;

  return (
    <Card className="mb-8 border-0 bg-background event-photos">
      <CardContent className="p-6">
        
      </CardContent>

      <style jsx>{`
        .event-photos {
          animation: slideUp 0.8s ease-out 0.8s both;
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

export default EventPhotos;