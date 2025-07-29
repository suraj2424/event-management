// components/events/EventsSearch.tsx
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface EventsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

const EventsSearch: React.FC<EventsSearchProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search events, locations, hosts..."
}) => {
  return (
    <div className="relative w-full max-w-xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 bg-background border-muted-foreground/20 focus-visible:border-ring"
      />
    </div>
  );
};

export default EventsSearch;