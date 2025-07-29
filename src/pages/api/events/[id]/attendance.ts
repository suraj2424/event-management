import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prismadb from "@/providers/prismaclient";
import { eventRedis } from "@/lib/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = (await getServerSession(req, res, authOptions)) as {
      user: { id: string };
    } | null;

    if (!session?.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "You must be signed in to access this endpoint",
      });
    }

    const { id } = req.query;
    const eventId = Number(id);

    if (isNaN(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await prismadb.event.findUnique({
      where: { id: eventId },
      select: { organizerId: true },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizerId === session.user.id) {
      return res.status(400).json({
        message: "Event creator is automatically registered",
        isRegistered: true,
      });
    }

    switch (req.method) {
      case "GET": {
        // Check cache first
        const cachedAttendance = await eventRedis.getCachedUserAttendance(
          eventId.toString(),
          session.user.id
        );
        if (cachedAttendance) {
          return res.status(200).json({
            isRegistered: !!cachedAttendance,
            attendance: cachedAttendance,
          });
        }

        // Original database query
        const attendance = await prismadb.attendance.findUnique({
          where: {
            userId_eventId: {
              userId: session.user.id,
              eventId: eventId,
            },
          },
        });

        // Cache the result
        if (attendance) {
          await eventRedis.cacheUserAttendance(
            eventId.toString(),
            session.user.id,
            attendance
          );
          await eventRedis.trackEventRegistration(
            eventId.toString(),
            session.user.id
          );
        }

        return res.status(200).json({
          isRegistered: !!attendance,
          attendance: attendance,
        });
      }

      case "POST": {
        // Check cache first for existing registration
        const isAlreadyRegistered = await eventRedis.isUserRegistered(
          eventId.toString(),
          session.user.id
        );
        if (isAlreadyRegistered) {
          const cachedAttendance = await eventRedis.getCachedUserAttendance(
            eventId.toString(),
            session.user.id
          );
          if (cachedAttendance) {
            return res.status(400).json({
              message: "Already registered for this event",
              attendance: cachedAttendance,
            });
          }
        }

        // Original database logic...
        const attendance = await prismadb.attendance.create({
          data: {
            userId: session.user.id,
            eventId: eventId,
            status: "REGISTERED",
          },
        });

        // Update cache after successful registration
        await eventRedis.cacheUserAttendance(
          eventId.toString(),
          session.user.id,
          attendance
        );
        await eventRedis.trackEventRegistration(
          eventId.toString(),
          session.user.id
        );

        return res.status(201).json({
          message: "Successfully registered for event",
          attendance: attendance,
        });
      }

      case "DELETE": {
        // Original database logic...
        const attendance = await prismadb.attendance
          .delete({
            where: {
              userId_eventId: {
                userId: session.user.id,
                eventId: eventId,
              },
            },
          })
          .catch(() => null);

        if (!attendance) {
          return res.status(404).json({
            message: "Not registered for this event",
          });
        }

        // Remove from cache after successful unregistration
        await eventRedis.removeEventRegistration(
          eventId.toString(),
          session.user.id
        );
        await eventRedis.invalidateAttendanceCache(
          eventId.toString(),
          session.user.id
        );

        return res.status(200).json({
          message: "Successfully unregistered from event",
          attendance: attendance,
        });
      }

      default:
        return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development" && error instanceof Error
          ? error.message
          : undefined,
    });
  }
}
