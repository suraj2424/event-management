// components/events/EventsFilters.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { EventType } from '@/types/events';

interface EventsFiltersProps {
  eventType: EventType;
  onEventTypeChange: (type: EventType) => void;
  isOpen?: boolean;
}

const EventsFilters: React.FC<EventsFiltersProps> = ({
  eventType,
  onEventTypeChange,
  isOpen = true
}) => {
  const filters = [
    { 
      key: 'all' as EventType, 
      label: 'All Events', 
      icon: Calendar,
      description: 'Browse all available events',
      count: null
    },
    { 
      key: 'upcoming' as EventType, 
      label: 'Upcoming', 
      icon: Clock,
      description: 'Events starting soon',
      count: null
    },
    { 
      key: 'ongoing' as EventType, 
      label: 'Ongoing', 
      icon: Users,
      description: 'Currently happening',
      count: null
    },
    { 
      key: 'past' as EventType, 
      label: 'Past', 
      icon: MapPin,
      description: 'Completed events',
      count: null
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-3">Event Status</h3>
        <div className="space-y-2">
          {filters.map(({ key, label, icon: Icon, description }) => (
            <Button
              key={key}
              variant={eventType === key ? "default" : "ghost"}
              onClick={() => onEventTypeChange(key)}
              className="w-full justify-start h-auto p-3 group"
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`p-1.5 rounded-md ${
                  eventType === key 
                    ? 'bg-background/20' 
                    : 'bg-muted group-hover:bg-muted/80'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{label}</div>
                  <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/80">
                    {description}
                  </div>
                </div>
                {eventType === key && (
                  <Badge variant="secondary" className="ml-auto">
                    ✓
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Additional Filter Sections (Optional) */}
      <div className="pt-4 border-t">
        <h3 className="font-semibold text-foreground mb-3">Quick Filters</h3>
        <div className="flex flex-wrap gap-2">
          {['This Week', 'Free Events', 'Online', 'Nearby'].map((filter) => (
            <Badge
              key={filter}
              variant="outline"
              className="cursor-pointer hover:bg-muted transition-colors text-xs"
            >
              {filter}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsFilters;