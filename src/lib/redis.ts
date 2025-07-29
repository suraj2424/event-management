// lib/redis.ts
import { Attendance } from "@/components/events/id/types";
import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    const redisUrl = process.env.REDIS_URL;
    const redisHost = "localhost";

    if (redisUrl) {
      redis = new Redis(redisUrl);
    } else {
      redis = new Redis({
        host: redisHost,
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        connectTimeout: 10000,
      });
    }

    redis.on("error", (err: Error) => {
      console.error("Redis connection error:", err);
    });

    redis.on("connect", () => {
      console.log("✅ Connected to Redis");
    });
  }

  return redis;
}

export class EventRedisService {
  private redis: Redis;

  constructor() {
    this.redis = getRedis();
  }

  // Basic operations
  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await this.redis.setex(key, ttlSeconds, serialized);
    } else {
      await this.redis.set(key, serialized);
    }
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.redis.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return await this.redis.ttl(key);
  }

  async disconnect(): Promise<void> {
    await this.redis.disconnect();
  }

  // Event list caching (for GET /api/events)
  async cacheEventList(
    filters: { page: number; limit: number; type: string },
    events: unknown[],
    totalPages: number,
    totalEvents: number,
    ttlSeconds: number = 300
  ): Promise<void> {
    const cacheKey = `events:list:${filters.type}:p${filters.page}:l${filters.limit}`;
    const cacheData = {
      events,
      currentPage: filters.page,
      totalPages,
      totalEvents,
      cachedAt: new Date().toISOString(),
    };
    await this.set(cacheKey, cacheData, ttlSeconds);
  }

  async getCachedEventList(filters: {
    page: number;
    limit: number;
    type: string;
  }): Promise<{
    events: unknown[];
    currentPage: number;
    totalPages: number;
    totalEvents: number;
  } | null> {
    const cacheKey = `events:list:${filters.type}:p${filters.page}:l${filters.limit}`;
    return await this.get(cacheKey);
  }

  // Individual event caching
  async cacheEvent(
    eventId: string,
    eventData: unknown,
    ttlSeconds: number = 1800
  ): Promise<void> {
    await this.set(`event:${eventId}`, eventData, ttlSeconds);
  }

  async getCachedEvent(eventId: string): Promise<unknown | null> {
    return await this.get(`event:${eventId}`);
  }

  // Event details caching (for GET /api/events/[id]/details)
  async cacheEventDetails(
    eventId: string,
    detailsData: unknown,
    ttlSeconds: number = 1800
  ): Promise<void> {
    await this.set(`event:${eventId}:details`, detailsData, ttlSeconds);
  }

  async getCachedEventDetails(eventId: string): Promise<unknown | null> {
    return await this.get(`event:${eventId}:details`);
  }

  // Event registration tracking (for /api/events/[id]/attendance)
  async trackEventRegistration(eventId: string, userId: string): Promise<void> {
    await this.redis.sadd(`event:${eventId}:registered`, userId);
    await this.redis.sadd(`user:${userId}:events`, eventId);
  }

  async removeEventRegistration(
    eventId: string,
    userId: string
  ): Promise<void> {
    await this.redis.srem(`event:${eventId}:registered`, userId);
    await this.redis.srem(`user:${userId}:events`, eventId);
  }

  async isUserRegistered(eventId: string, userId: string): Promise<boolean> {
    const result = await this.redis.sismember(
      `event:${eventId}:registered`,
      userId
    );
    return result === 1;
  }

  async getEventRegistrationCount(eventId: string): Promise<number> {
    return await this.redis.scard(`event:${eventId}:registered`);
  }

  async getUserRegisteredEvents(userId: string): Promise<string[]> {
    return await this.redis.smembers(`user:${userId}:events`);
  }

  // Cache invalidation for specific event
  async invalidateEventCache(eventId: string): Promise<void> {
    await this.del(`event:${eventId}`);
    await this.del(`event:${eventId}:details`);
  }

  // Add these methods to EventRedisService class

  // User attendance caching
  async cacheUserAttendance(
    eventId: string,
    userId: string,
    attendanceData: unknown,
    ttlSeconds: number = 1800
  ): Promise<void> {
    await this.set(
      `attendance:${eventId}:${userId}`,
      attendanceData,
      ttlSeconds
    );
  }

  async getCachedUserAttendance(
    eventId: string,
    userId: string
  ): Promise<unknown | null> {
    return await this.get(`attendance:${eventId}:${userId}`);
  }

  async removeCachedUserAttendance(
    eventId: string,
    userId: string
  ): Promise<void> {
    await this.del(`attendance:${eventId}:${userId}`);
  }

  // Cache event registration counts
  async cacheEventRegistrationCount(
    eventId: string,
    count: number,
    ttlSeconds: number = 600
  ): Promise<void> {
    await this.set(`event:${eventId}:count`, count, ttlSeconds);
  }

  async getCachedEventRegistrationCount(
    eventId: string
  ): Promise<number | null> {
    return await this.get(`event:${eventId}:count`);
  }

  // Invalidate attendance-related caches
  async invalidateAttendanceCache(
    eventId: string,
    userId: string
  ): Promise<void> {
    await this.removeCachedUserAttendance(eventId, userId);
    await this.del(`event:${eventId}:count`);
  }

  // User profile caching
  async cacheUserProfile(
    userId: string,
    profileData: unknown,
    ttlSeconds: number = 3600
  ): Promise<void> {
    await this.set(`user:${userId}:profile`, profileData, ttlSeconds);
  }

  async getCachedUserProfile(userId: string): Promise<unknown | null> {
    return await this.get(`user:${userId}:profile`);
  }

  async invalidateUserProfile(userId: string): Promise<void> {
    await this.del(`user:${userId}:profile`);
  }

  // User session/profile validation cache
  async cacheUserExists(
    userId: string,
    exists: boolean,
    ttlSeconds: number = 1800
  ): Promise<void> {
    await this.set(`user:${userId}:exists`, exists, ttlSeconds);
  }

  async getCachedUserExists(userId: string): Promise<boolean | null> {
    return await this.get(`user:${userId}:exists`);
  }

  // Email uniqueness check cache
  async cacheEmailCheck(
    email: string,
    userId: string | null,
    ttlSeconds: number = 600
  ): Promise<void> {
    await this.set(
      `email:${email}:available`,
      { available: !userId, userId },
      ttlSeconds
    );
  }

  async getCachedEmailCheck(
    email: string
  ): Promise<{ available: boolean; userId: string | null } | null> {
    return await this.get(`email:${email}:available`);
  }

  async invalidateEmailCache(email: string): Promise<void> {
    await this.del(`email:${email}:available`);
  }

  // Invalidate all user-related caches
  async invalidateUserCaches(
    userId: string,
    oldEmail?: string,
    newEmail?: string
  ): Promise<void> {
    await this.invalidateUserProfile(userId);

    if (oldEmail) {
      await this.invalidateEmailCache(oldEmail);
    }
    if (newEmail) {
      await this.invalidateEmailCache(newEmail);
    }
  }

  // User registered events caching (for GET method)
  async cacheUserRegisteredEvents(
    userId: string,
    events: unknown[],
    pagination: { total: number; page: number; limit: number; pages: number },
    ttlSeconds: number = 600
  ): Promise<void> {
    const cacheKey = `user:${userId}:registered_events:p${pagination.page}:l${pagination.limit}`;
    const cacheData = {
      events,
      pagination,
      cachedAt: new Date().toISOString(),
    };
    await this.set(cacheKey, cacheData, ttlSeconds);
  }

  async getCachedUserRegisteredEvents(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ events: unknown[]; pagination: unknown } | null> {
    const cacheKey = `user:${userId}:registered_events:p${page}:l${limit}`;
    return await this.get(cacheKey);
  }

  // User attendance records caching
  async cacheUserAttendanceRecords(
    userId: string,
    attendanceRecords: unknown[],
    ttlSeconds: number = 1800
  ): Promise<void> {
    await this.set(
      `user:${userId}:attendance_records`,
      attendanceRecords,
      ttlSeconds
    );
  }

  async getCachedUserAttendanceRecords(
    userId: string
  ): Promise<unknown[] | null> {
    return await this.get(`user:${userId}:attendance_records`);
  }

  // User's organized events caching
  async cacheUserOrganizedEvents(
    userId: string,
    events: unknown[],
    ttlSeconds: number = 1800
  ): Promise<void> {
    await this.set(`user:${userId}:organized_events`, events, ttlSeconds);
  }

  async getCachedUserOrganizedEvents(
    userId: string
  ): Promise<unknown[] | null> {
    return await this.get(`user:${userId}:organized_events`);
  }

  // Cache user's total registered events count
  async cacheUserEventsCount(
    userId: string,
    count: number,
    ttlSeconds: number = 1800
  ): Promise<void> {
    await this.set(`user:${userId}:events_count`, count, ttlSeconds);
  }

  async getCachedUserEventsCount(userId: string): Promise<number | null> {
    return await this.get(`user:${userId}:events_count`);
  }

  // Update attendance status in cache
  async updateAttendanceStatus(
    userId: string,
    eventId: string,
    status: string
  ): Promise<void> {
    // Update the cached attendance record
    const cachedAttendance = await this.getCachedUserAttendance(
      eventId,
      userId
    );
    if (cachedAttendance) {
      const updatedAttendance = { ...(cachedAttendance as Attendance), status };
      await this.cacheUserAttendance(eventId, userId, updatedAttendance);
    }

    // If status is CANCELLED, remove from registered sets
    if (status === "CANCELLED") {
      await this.removeEventRegistration(eventId, userId);
    }
  }

  // Comprehensive cache invalidation for user events
  async invalidateUserEventsCaches(userId: string): Promise<void> {
    // Get all cache keys for this user's events
    const patterns = [
      `user:${userId}:registered_events:*`,
      `user:${userId}:attendance_records`,
      `user:${userId}:organized_events`,
      `user:${userId}:events_count`,
      `user:${userId}:events`, // from previous methods
    ];

    for (const pattern of patterns) {
      if (pattern.includes("*")) {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      } else {
        await this.del(pattern);
      }
    }
  }

  // Event deletion cache cleanup
  async invalidateEventCaches(eventId: string): Promise<void> {
    const patterns = [
      `event:${eventId}*`,
      `attendance:${eventId}:*`,
      "events:list:*", // Invalidate all event lists
      "popular:events", // Remove from popular events
    ];

    for (const pattern of patterns) {
      if (pattern.includes("*")) {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      } else {
        await this.del(pattern);
      }
    }

    // Remove from popular events sorted set
    await this.redis.zrem("popular:events", eventId);
  }

  // Cache user's event IDs for quick lookup
  async cacheUserEventIds(
    userId: string,
    eventIds: number[],
    ttlSeconds: number = 1800
  ): Promise<void> {
    await this.set(`user:${userId}:event_ids`, eventIds, ttlSeconds);
  }

  async getCachedUserEventIds(userId: string): Promise<number[] | null> {
    return await this.get(`user:${userId}:event_ids`);
  }
}

export const eventRedis = new EventRedisService();
