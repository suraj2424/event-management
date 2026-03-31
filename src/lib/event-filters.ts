// lib/event-filters.ts
import { Prisma } from "@prisma/client";

export const buildEventFilter = (eventType: string, searchTerm: string) => {
  const currentDate = new Date();
  const conditions: Prisma.EventWhereInput[] = [];

  // 1. Handle Status Filter
  switch (eventType) {
    case "upcoming":
      conditions.push({ startDate: { gt: currentDate } });
      break;
    case "ongoing":
      conditions.push({
        startDate: { lte: currentDate },
        endDate: { gte: currentDate },
      });
      break;
    case "past":
      conditions.push({ endDate: { lt: currentDate } });
      break;
  }

  // 2. Handle Search Filter
  if (searchTerm) {
    conditions.push({
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { location: { contains: searchTerm, mode: "insensitive" } },
        { hostName: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  // Combine using AND so that (Status AND Search) both must be true
  return conditions.length > 0 ? { AND: conditions } : {};
};

export const getEventStatus = (start: Date, end: Date) => {
  const now = new Date();
  if (now > end) return "PAST";
  if (now >= start && now <= end) return "ONGOING";
  return "UPCOMING";
};