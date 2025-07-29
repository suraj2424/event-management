// components/events/EventsEmptyState.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Search } from 'lucide-react';

interface EventsEmptyStateProps {
  searchTerm?: string;
  onClearSearch?: () => void;
}

const EventsEmptyState: React.FC<EventsEmptyStateProps> = ({
  searchTerm,
  onClearSearch
}) => {
  return (
    <Card className="border-0 bg-muted/20">
      <CardContent className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 text-muted-foreground/40">
          {searchTerm ? <Search className="w-full h-full" /> : <Calendar className="w-full h-full" />}
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {searchTerm ? 'No events match your search' : 'No events found'}
        </h3>
        
        <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
          {searchTerm 
            ? 'Try adjusting your search terms or browse all events to discover something new.'
            : 'There are no events available at the moment. Check back later for exciting new events!'
          }
        </p>
        
        {searchTerm && onClearSearch && (
          <Button 
            variant="outline" 
            onClick={onClearSearch}
            className="mx-auto"
          >
            Clear Search
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsEmptyState;