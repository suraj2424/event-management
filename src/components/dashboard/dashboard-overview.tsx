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
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { format, isValid } from "date-fns";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    try {
      setError(null);
      const [statsRes, eventsRes] = await Promise.all([
        fetch(`${baseUrl}/api/dashboard/stats`),
        fetch(`${baseUrl}/api/dashboard/recent-events`),
      ]);

      if (!statsRes.ok || !eventsRes.ok) throw new Error("Failed to fetch data");

      const statsData = await statsRes.json();
      const eventsData = await eventsRes.json();

      setStats(statsData);
      setRecentEvents(eventsData.events || []);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      setError("Could not load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: EventStatus) => {
    const configs = {
      [EventStatus.UPCOMING]: { color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Clock },
      [EventStatus.ONGOING]: { color: "bg-green-500/10 text-green-500 border-green-500/20", icon: Play },
      [EventStatus.PAST]: { color: "bg-muted text-muted-foreground border-transparent", icon: Archive },
    };
    return configs[status];
  };

  const getQuickActions = () => {
    const role = session?.user.role;
    if (role === UserRole.ORGANIZER) return [
      { label: "Create Event", href: "/dashboard/events/create", icon: Plus },
      { label: "View All Events", href: "/dashboard/events", icon: Calendar },
      { label: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
    ];
    if (role === UserRole.ATTENDEE) return [
      { label: "Browse Events", href: "/events", icon: Calendar },
      { label: "My Tickets", href: "/dashboard/tickets", icon: Eye },
    ];
    return [];
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="h-10 w-64 bg-muted rounded-md animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-24 animate-pulse bg-muted/50" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 h-64 animate-pulse bg-muted/50" />
          <Card className="h-64 animate-pulse bg-muted/50" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold">{error}</h3>
        <Button onClick={fetchDashboardData} variant="outline" className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session?.user.name?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          {session?.user.role === UserRole.ORGANIZER 
            ? "Manage your events and track performance." 
            : "Explore events and manage your bookings."}
        </p>
      </div>

      {/* Statistics Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Events" value={stats.totalEvents} icon={Calendar} />
        <StatCard title="Upcoming" value={stats.upcomingEvents} icon={Clock} color="text-blue-500" />
        <StatCard title="Ongoing" value={stats.ongoingEvents} icon={Play} color="text-green-500" />
        <StatCard title="Attendees" value={stats.totalAttendees} icon={Users} color="text-purple-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Events Table/List */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/events" className="text-primary">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentEvents.length === 0 ? (
              <EmptyState role={session?.user.role as UserRole} />
            ) : (
              <div className="space-y-4">
                {recentEvents.map((event) => {
                  const config = getStatusConfig(event.status);
                  const eventDate = new Date(event.startDate);
                  return (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-all group">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold group-hover:text-primary transition-colors">{event.title}</span>
                          <Badge variant="outline" className={config.color}>
                            <config.icon className="mr-1 h-3 w-3" />
                            {event.status.toLowerCase()}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {isValid(eventDate) ? format(eventDate, "PPP") : "TBA"}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.attendeeCount} / {event.capacity}
                          </span>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" asChild>
                        <Link href={`/dashboard/events/${event.id}`}><Eye className="h-4 w-4" /></Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Side Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {getQuickActions().map((action) => (
              <Button key={action.href} variant="outline" className="w-full justify-start h-12 text-sm font-medium" asChild>
                <Link href={action.href}>
                  <action.icon className="mr-3 h-4 w-4 text-primary" />
                  {action.label}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* --- Sub-components for cleaner code --- */

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}

function StatCard({ title, value, icon: Icon, color = "text-muted-foreground" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg bg-muted ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ role }: { role: UserRole }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl">
      <Calendar className="h-10 w-10 text-muted-foreground/40 mb-3" />
      <p className="text-muted-foreground font-medium">No recent events found</p>
      {role === UserRole.ORGANIZER && (
        <Button className="mt-4" size="sm" asChild>
          <Link href="/dashboard/events/create">Create your first event</Link>
        </Button>
      )}
    </div>
  );
}