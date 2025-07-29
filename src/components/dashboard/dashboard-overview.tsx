import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Play,
  Archive,
  Plus,
  Eye,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { CustomSession, EventStatus, UserRole } from "../event-form/types/event";

interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  ongoingEvents: number;
  pastEvents: number;
  totalAttendees: number;
  totalRevenue?: number;
}

interface RecentEvent {
  id: string;
  title: string;
  startDate: string;
  location: string;
  attendeeCount: number;
  capacity: number;
  status: EventStatus;
}

export function DashboardOverview() {
  const { data: session } = useSession() as { data: CustomSession | null };
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    ongoingEvents: 0,
    pastEvents: 0,
    totalAttendees: 0,
  });
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const url = process.env.VERCEL_URL || "http://localhost:3000";
    try {
      const [statsResponse, eventsResponse] = await Promise.all([
        fetch(`${url}/api/dashboard/stats`),
        fetch(`${url}/api/dashboard/recent-events`),
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setRecentEvents(eventsData.events);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: EventStatus) => {
    switch (status) {
      case EventStatus.UPCOMING:
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: Clock,
        };
      case EventStatus.ONGOING:
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: Play,
        };
      case EventStatus.PAST:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: Archive,
        };
    }
  };

  const getWelcomeMessage = () => {
    switch (session?.user.role) {
      case UserRole.ORGANIZER:
        return "Welcome back! Here's an overview of your events.";
      case UserRole.ATTENDEE:
        return "Welcome back! Here's your event activity.";
      case UserRole.ADMIN:
        return "Welcome back! Here's the platform overview.";
      default:
        return "Welcome back!";
    }
  };

  const getQuickActions = () => {
    switch (session?.user.role) {
      case UserRole.ORGANIZER:
        return [
          { label: "Create Event", href: "/dashboard/events/create", icon: Plus },
          { label: "View All Events", href: "/dashboard/events", icon: Calendar },
          { label: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
        ];
      case UserRole.ATTENDEE:
        return [
          { label: "Browse Events", href: "/events", icon: Calendar },
          { label: "My Tickets", href: "/dashboard/tickets", icon: Users },
          { label: "Favorites", href: "/dashboard/favorites", icon: Users },
        ];
      case UserRole.ADMIN:
        return [
          { label: "Manage Users", href: "/dashboard/users", icon: Users },
          { label: "All Events", href: "/dashboard/events", icon: Calendar },
          { label: "System Analytics", href: "/dashboard/analytics", icon: TrendingUp },
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session?.user.name}!
        </h1>
        <p className="text-muted-foreground">{getWelcomeMessage()}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Events
                </p>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-blue-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Upcoming
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.upcomingEvents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Play className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Ongoing
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.ongoingEvents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-purple-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Attendees
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalAttendees}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Events */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Events</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/events">
                View All
                <Eye className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-muted-foreground">No events yet</p>
                {session?.user.role === UserRole.ORGANIZER && (
                  <Button className="mt-4" asChild>
                    <Link href="/dashboard/events/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Event
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {recentEvents.map((event) => {
                  const statusConfig = getStatusConfig(event.status);
                  if (!statusConfig) return null;
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge className={`${statusConfig.color} border`}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {event.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(event.startDate), "MMM dd, yyyy")}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.attendeeCount}/{event.capacity}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/events/${event.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getQuickActions().map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.href}
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={action.href}>
                      <Icon className="mr-2 h-4 w-4" />
                      {action.label}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}