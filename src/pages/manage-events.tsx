// manage-events.tsx
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";

import { Plus,Search, Edit, Trash2, Home, Calendar, MapPin, Users, Sparkles, ArrowRight, Filter } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

interface Event {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  status: string;
}

export default function ManageEvents() {
  const { data: session } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
      const res = await fetch(`${url}/api/events/manage`);
      const data = await res.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    try {
      const res = await fetch(`${url}/api/profile/events?eventId=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Event deleted successfully");
        fetchEvents();
      } else {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error deleting event");
    }
    setDeleteId(null);
  };

  if (!session?.user) {
    return (
      <div className="h-screen flex items-center justify-center bg-white p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You need to be signed in as an organizer to manage events.
            </p>
            <Button onClick={() => router.push("/")} variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (session.user.role !== "ORGANIZER") {
    return (
      <div className="h-screen flex items-center justify-center bg-white p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Organizer Access Only
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              This page is only accessible to event organizers.
            </p>
            <Button onClick={() => router.push("/")} variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-white">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

interface EventWithDates {
    startDate: string;
    endDate: string;
}

const eventStatus = (event: EventWithDates): "PAST" | "UPCOMING" | "ONGOING" => {
    // if event date is in the past then event.status = "PAST"
    // if event date is in the future then event.status = "UPCOMING"
    // if event date is in between the start date and end date then event.status = "ONGOGING"
    const currentDate: Date = new Date();
    const startDate: Date = new Date(event.startDate);
    const endDate: Date = new Date(event.endDate);


    if (currentDate > endDate) {
        return "PAST";
    } else if (currentDate < startDate) {
        return "UPCOMING";
    } else {
        return "ONGOING";
    }
}

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const status = eventStatus(event).toUpperCase();
    const matchesFilter = filterStatus === 'All' || status === filterStatus.toUpperCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-10 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1}}
          transition={{ duration: 0.5 }}
          className="space-y-8 transition-all duration-300 ease-in-out"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-4 md:mb-0">
              Manage Your Events
            </h1>
            <Button
              onClick={() => router.push("/create-event")}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Event
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter: {filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus('All')}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('Upcoming')}>Upcoming</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('Ongoing')}>Ongoing</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('Past')}>Past</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{format(new Date(event.startDate), "MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event.capacity} attendees</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        eventStatus(event) === "ONGOING"
                          ? "bg-green-100 text-green-800"
                          : eventStatus(event) === "UPCOMING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {eventStatus(event)}
                      </span>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/events/${event.id}/edit`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => setDeleteId(event.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-indigo-500" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Events Found</h2>
              <p className="text-gray-500 mb-8">
                {searchTerm || filterStatus !== 'All'
                  ? "Try adjusting your search or filter settings."
                  : "Start creating amazing events and watch your calendar fill up!"}
              </p>
              {!searchTerm && filterStatus === 'All' && (
                <Button 
                  onClick={() => router.push("/create-event")} 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                >
                  Create Your First Event
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* AlertDialog for delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white/80 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-100 hover:bg-slate-200">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}