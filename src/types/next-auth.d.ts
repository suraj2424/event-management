import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    expires: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "ADMIN" | "ORGANIZER" | "ATTENDEE";
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: "ADMIN" | "ORGANIZER" | "ATTENDEE";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "ORGANIZER" | "ATTENDEE";
    name?: string | null;
    email?: string | null;
    picture?: string | null;
  }
}