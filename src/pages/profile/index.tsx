import React from "react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import ProfileClient from "@/components/profile/ProfileClient";
import prismadb from "@/providers/prismaclient";
import type { Session } from "next-auth";

interface UserProfile {
  name: string;
  email: string;
  role: "ADMIN" | "ORGANIZER" | "ATTENDEE";
  avatar?: string;
}

interface AttendedEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  status: string;
  attendance: {
    status: string;
    userId: string;
  }[];
}

// Serializable session type that matches our next-auth.d.ts
interface SerializableSession {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: "ADMIN" | "ORGANIZER" | "ATTENDEE";
  };
  expires: string;
}

interface ProfilePageProps {
  initialProfile: UserProfile;
  initialEvents: AttendedEvent[];
  session: SerializableSession;
  error?: string;
}

export default function ProfilePage({
  initialProfile,
  initialEvents,
  session,
  error,
}: ProfilePageProps) {
  return (
    <ProfileClient
      initialProfile={initialProfile}
      initialEvents={initialEvents}
      session={session}
      error={error}
    />
  );
}

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions) as Session | null;

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  try {
    // Fetch user profile
    const user = await prismadb.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const profile: UserProfile = {
      name: user.name || "",
      email: user.email,
      role: user.role as "ADMIN" | "ORGANIZER" | "ATTENDEE",
    };

    // Fetch user events
    const events = await prismadb.event.findMany({
      where: {
        attendance: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        attendance: {
          where: {
            userId: session.user.id,
          },
          select: {
            status: true,
            userId: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    const attendedEvents: AttendedEvent[] = events.map(event => ({
      id: event.id.toString(),
      title: event.title,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      location: event.location,
      status: "UNKNOWN",
      attendance: event.attendance,
    }));

    // Create serializable session object
    const serializableSession: SerializableSession = {
      user: {
        id: session.user.id,
        name: session.user.name || null,
        email: session.user.email || null,
        image: session.user.image || null,
        role: session.user.role,
      },
      expires: session.expires,
    };

    return {
      props: {
        initialProfile: profile,
        initialEvents: attendedEvents,
        session: serializableSession,
      },
    };
  } catch (error) {
    console.error("Error fetching profile data:", error);
    
    // Create serializable session object for error case
    const serializableSession: SerializableSession = {
      user: {
        id: session.user.id,
        name: session.user.name || null,
        email: session.user.email || null,
        image: session.user.image || null,
        role: session.user.role,
      },
      expires: session.expires,
    };
    
    return {
      props: {
        initialProfile: {
          name: "",
          email: session.user.email || "",
          role: "ATTENDEE" as const,
        },
        initialEvents: [],
        session: serializableSession,
        error: "Failed to load profile data",
      },
    };
  }
};