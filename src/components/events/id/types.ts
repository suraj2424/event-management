// components/events/id/types.ts
export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

export interface SpecialGuest {
  id: number;
  guestName: string;
  guestDescription: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  logo: string;
  location: string;
  capacity: number;
  status: string;
  photos: string[];
  contactEmail: string;
  contactPhone: string;
  hostName: string;
  hostDescription: string;
  price?: number;
  currency?: string;
  organizer: { name: string; email: string };
}

export interface EventDetails {
  specialGuests: SpecialGuest[];
  socialLinks: SocialLinks;
}

export interface Attendance {
  status: string | null;
  isRegistered: boolean;
}