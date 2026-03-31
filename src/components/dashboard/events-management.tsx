"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Calendar, MapPin, Users, MoreHorizontal, Edit, Trash2,
  Eye, Plus, Search, Filter, Clock, Play, Archive
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { EventStatus } from "../event-form/types/event";

// --- Constants ---
const STATUS_CONFIG = {
  [EventStatus.UPCOMING]: { color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: Clock, label: "Upcoming" },
  [EventStatus.ONGOING]: { color: "bg-green-500/10 text-green-600 border-green-200", icon: Play, label: "Ongoing" },
  [EventStatus.PAST]: { color: "bg-gray-100 text-gray-600 border-gray-200", icon: Archive, label: "Past" },
};

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  attendeeCount: number;
  status: EventStatus;
}

export function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/events/manage`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/events/manage?id=${eventId}`, { method: "DELETE" });
      if (response.ok) {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        setDeleteEventId(null);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // --- Memoized Logic ---
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || event.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, searchTerm, statusFilter]);

  const stats = useMemo(() => ({
    total: events.length,
    upcoming: events.filter(e => e.status === EventStatus.UPCOMING).length,
    ongoing: events.filter(e => e.status === EventStatus.ONGOING).length,
    past: events.filter(e => e.status === EventStatus.PAST).length,
  }), [events]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">My Events</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage, track, and analyze your event portfolio.</p>
        </div>
        <Button asChild size="lg" className="shadow-lg shadow-primary/20">
          <Link href="/dashboard/events/create">
            <Plus className="mr-2 h-5 w-5" /> Create Event
          </Link>
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={stats.total} icon={Calendar} color="text-primary" />
        <StatCard title="Upcoming" value={stats.upcoming} icon={Clock} color="text-blue-500" />
        <StatCard title="Ongoing" value={stats.ongoing} icon={Play} color="text-green-500" />
        <StatCard title="Past" value={stats.past} icon={Archive} color="text-muted-foreground" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 border-none bg-muted/50 focus-visible:ring-1"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px] h-11 bg-muted/50 border-none">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value={EventStatus.UPCOMING}>Upcoming</SelectItem>
            <SelectItem value={EventStatus.ONGOING}>Ongoing</SelectItem>
            <SelectItem value={EventStatus.PAST}>Past</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <EmptyState isFiltering={!!searchTerm || statusFilter !== "all"} />
        ) : (
          filteredEvents.map((event) => (
            <EventItem 
              key={event.id} 
              event={event} 
              onDeleteClick={(id) => setDeleteEventId(id)} 
            />
          ))
        )}
      </div>

      {/* Confirmation Modals */}
      <DeleteDialog 
        isOpen={!!deleteEventId} 
        onClose={() => setDeleteEventId(null)} 
        onConfirm={() => deleteEventId && handleDeleteEvent(deleteEventId)} 
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}

// --- Sub-Components ---

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <Card className="overflow-hidden border-none bg-card shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className={`p-3 rounded-xl bg-muted ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EventItem({ event, onDeleteClick }: { event: Event; onDeleteClick: (id: string) => void }) {
  const config = STATUS_CONFIG[event.status] || STATUS_CONFIG[EventStatus.UPCOMING];
  const Icon = config.icon;

  return (
    <Card className="group hover:border-primary/50 transition-all duration-300 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Status Indicator Bar */}
          <div className={`w-1.5 ${config.color.split(' ')[0].replace('bg-', 'bg-')}`} />
          
          <div className="flex-1 p-6 flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{event.title}</h3>
                <Badge variant="outline" className={`${config.color} border-none font-semibold px-3`}>
                  <Icon className="mr-1.5 h-3.5 w-3.5" />
                  {config.label}
                </Badge>
              </div>

              <p className="text-muted-foreground line-clamp-2 max-w-2xl text-sm leading-relaxed">
                {event.description}
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground/80">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> 
                  {format(new Date(event.startDate), "MMM dd")} - {format(new Date(event.endDate), "MMM dd, yyyy")}
                </span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-red-400" /> {event.location}</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-blue-400" /> {event.attendeeCount}/{event.capacity}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center bg-muted/30 p-2 rounded-xl">
              <Button asChild variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg">
                <Link href={`/events/${event.id}`}><Eye className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg">
                <Link href={`/dashboard/events/${event.id}/edit`}><Edit className="h-4 w-4" /></Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/events/${event.id}/attendees`}>Manage Attendees</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/events/${event.id}/analytics`}>View Analytics</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                    onSelect={() => onDeleteClick(event.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Event
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ isFiltering }: { isFiltering: boolean }) {
  return (
    <Card className="border-dashed py-20 bg-muted/20">
      <CardContent className="flex flex-col items-center text-center">
        <div className="p-4 rounded-full bg-muted mb-4">
          <Calendar className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-bold">No events found</h3>
        <p className="text-muted-foreground mt-2 max-w-[300px]">
          {isFiltering ? "Try adjusting your search or filters to find what you're looking for." : "You haven't created any events yet."}
        </p>
        {!isFiltering && (
          <Button asChild className="mt-6">
            <Link href="/dashboard/events/create">Create your first event</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-20 bg-muted animate-pulse rounded-xl w-1/3" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}
      </div>
      {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />)}
    </div>
  );
}

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteDialog({ isOpen, onClose, onConfirm }: DeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Event?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the event and all associated attendee data. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}