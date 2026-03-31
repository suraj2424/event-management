import * as z from "zod";
import { Session } from "next-auth";

export enum UserRole {
  ADMIN = "ADMIN",
  ORGANIZER = "ORGANIZER",
  ATTENDEE = "ATTENDEE"
}

export enum EventStatus {
  UPCOMING = "UPCOMING",
  ONGOING = "ONGOING",
  PAST = "PAST"
}

export interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole;
  };
}

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  location: z.string().min(1, "Location is required"),
  capacity: z.coerce.number().int().positive(),
  price: z.coerce.number().min(0).optional(),
  currency: z.string().default("USD"),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(1),
  hostName: z.string().min(1),
  socialLinks: z.object({
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
  }),
  specialGuests: z.array(
    z.object({
      guestName: z.string(),
      guestDescription: z.string(),
    })
  ).default([]),
});

export type EventFormValues = z.infer<typeof eventSchema>;