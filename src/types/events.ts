// components/events/types.ts
export interface Event {
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

export type EventType = 'all' | 'upcoming' | 'ongoing' | 'past';

export interface EventsClientProps {
  initialEvents: Event[];
  initialTotalPages: number;
  initialError: string | null;
  initialPage: number;
  initialEventType: EventType;
  initialSearchTerm?: string;
}