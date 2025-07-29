// components/events/EventsGrid.tsx
import React from 'react';
import EventList from '@/components/parts/EventList';
import { Event } from '@/types/events';

interface EventsGridProps {
  events: Event[];
}

const EventsGrid: React.FC<EventsGridProps> = ({ events }) => {
  return (
    <div className="events-grid">
      <EventList events={events} />
      
      <style jsx>{`
        .events-grid {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(16px);
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

export default EventsGrid;