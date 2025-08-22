import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prismadb from "@/providers/prismaclient";
// import { eventRedis } from "@/lib/redis";
// import { User } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // GET user profile
  if (req.method === "GET") {
    try {
      // const cachedProfile = await eventRedis.getCachedUserProfile(
      //   session.user.id
      // );
      // if (cachedProfile) {
      //   return res.status(200).json(cachedProfile);
      // }

      const user = await prismadb.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        // await eventRedis.cacheUserExists(session.user.id, false);
        return res.status(404).json({ message: "User not found" });
      }

      // Cache the profile data
      // await eventRedis.cacheUserProfile(session.user.id, user);
      // await eventRedis.cacheUserExists(session.user.id, true);

      // Compute real-time stats based on current prisma schema
      const now = new Date();

      // Organizer stats
      const [eventsCreated, totalAttendees] = await Promise.all([
        prismadb.event.count({
          where: { organizerId: session.user.id },
        }),
        prismadb.attendance.count({
          where: {
            event: { organizerId: session.user.id },
          },
        }),
      ]);

      // Attendee stats
      const [eventsAttended, upcomingEvents] = await Promise.all([
        prismadb.attendance.count({
          where: {
            userId: session.user.id,
            status: { in: ["REGISTERED", "CONFIRMED", "ATTENDED"] },
          },
        }),
        prismadb.attendance.count({
          where: {
            userId: session.user.id,
            status: { in: ["REGISTERED", "CONFIRMED"] },
            event: { startDate: { gt: now } },
          },
        }),
      ]);

      const payload = {
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        stats: {
          eventsCreated,
          totalAttendees,
          eventsAttended,
          upcomingEvents,
        },
      };

      return res.status(200).json(payload);
    } catch (error) {
      console.error("Profile fetch error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // UPDATE user profile
  if (req.method === 'PUT') {
  try {
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Check cache for email availability first
    // const cachedEmailCheck = await eventRedis.getCachedEmailCheck(email);
    // if (cachedEmailCheck && !cachedEmailCheck.available && cachedEmailCheck.userId !== session.user.id) {
    //   return res.status(400).json({ message: 'Email already in use' });
    // }

    // Get current user data for old email
    // const currentUser = await eventRedis.getCachedUserProfile(session.user.id);
    // const oldEmail = currentUser ? (currentUser as User).email : null;

    // Check if email is already taken by another user (if not cached)
    
      const existingUser = await prismadb.user.findFirst({
        where: {
          email,
          NOT: { id: session.user.id }
        }
      });

      if (existingUser) {
        // await eventRedis.cacheEmailCheck(email, existingUser.id);
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      // Cache that email is available
      // await eventRedis.cacheEmailCheck(email, null);
    

    // Update user in database
    const updatedUser = await prismadb.user.update({
      where: { id: session.user.id },
      data: { name, email },
      select: {
        name: true,
        email: true,
        role: true
      }
    });

    // // Update caches after successful update
    // await eventRedis.cacheUserProfile(session.user.id, updatedUser);
    // await eventRedis.invalidateUserCaches(session.user.id, oldEmail ?? undefined, email);

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

  return res.status(405).json({ message: "Method not allowed" });
}
