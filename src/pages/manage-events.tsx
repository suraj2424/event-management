// manage-events.tsx
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from 'next-auth/react';

import { Plus, Edit, Trash2, Home } from "lucide-react";
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

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events/manage");
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
    try {
      const res = await fetch(`/api/profile/events?eventId=${id}`, {
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
      <Card className="w-full max-w-3xl mx-auto mt-8">
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
    );
  }

  if (session.user.role !== "ORGANIZER") {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8">
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
    );
  }

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center mx-auto py-8 text-center">
        <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin">
        </div>
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

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center px-4">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <div className="ml-auto flex items-center space-x-4">
        <Button onClick={() => router.push("/create-event")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                        <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {session.user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                    Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
      </div>

      <div className="px-4">
        <Card>
          <CardHeader>
            <CardTitle>Your Events</CardTitle>
            <CardDescription>Manage and monitor your events</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      {format(new Date(event.startDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(event.endDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{event.capacity}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          eventStatus(event) === "ONGOING"
                            ? "bg-green-100 text-green-800"
                            : event.status === "UPCOMING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {eventStatus(event)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/events/${event.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
