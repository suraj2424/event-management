"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Shield,
  LogOut,
  Settings,
  Bell,
} from "lucide-react";
import toast from "react-hot-toast";

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

// Serializable session type
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

interface ProfileClientProps {
  initialProfile: UserProfile;
  initialEvents: AttendedEvent[];
  session: SerializableSession;
  error?: string;
}

export default function ProfileClient({
  initialProfile,
  initialEvents,
  session,
  error: initialError,
}: ProfileClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [attendedEvents, setAttendedEvents] = useState<AttendedEvent[]>(initialEvents);
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
      const res = await fetch(`${url}/api/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";


    try {
      const res = await fetch(`${url}/api/profile/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: password.current,
          newPassword: password.new,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update password");
      }

      toast.success("Password updated successfully");
      setPassword({ current: "", new: "", confirm: "" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/signin");
  };

  const getEventStatus = (event: AttendedEvent) => {
    const currentDate = new Date();
    const endDate = new Date(event.endDate);

    if (currentDate > endDate) {
      return "ATTENDED";
    }

    if (event.attendance && event.attendance.length > 0) {
      return event.attendance[0].status;
    }

    return "REGISTERED";
  };

  const handleCancelAttendance = async (eventId: string) => {
    setLoading(true);
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
      const response = await fetch(`${url}/api/events/${eventId}/attendance`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to cancel attendance");
      }
      
      toast.success("Attendance canceled successfully");
      
      // Update the local state instead of reloading
      setAttendedEvents(prev => prev.filter(event => event.id !== eventId));
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error canceling attendance:", error);
      setError(error instanceof Error ? error.message : "Failed to cancel attendance");
    } finally {
      setLoading(false);
    }
  };

  // Show error state if there was an initial error
  if (initialError) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>{initialError}</AlertDescription>
          </Alert>
          <Button 
            onClick={() => router.reload()} 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex flex-col items-center sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center sm:flex-row sm:space-x-4 mb-4 sm:mb-0">
            <Avatar className="h-20 w-20 mb-2 sm:mb-0">
              <AvatarImage src={profile.avatar || session.user.image || undefined} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h1 className="text-xl font-bold">{profile.name}</h1>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <Badge variant="secondary" className="mt-1">{profile.role}</Badge>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/profile/settings")}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/notifications")}
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Rest of the component remains the same... */}
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="events">My Events</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information and password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={profile.name || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      Role
                    </Label>
                    <Badge variant="secondary">{profile.role}</Badge>
                  </div>
                  {isEditing ? (
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto"
                      >
                                                {loading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto"
                    >
                      Edit Profile
                    </Button>
                  )}
                </form>

                <div className="pt-6">
                  <CardTitle className="text-lg mb-4">
                    Change Password
                  </CardTitle>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={password.current}
                        onChange={(e) =>
                          setPassword({ ...password, current: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={password.new}
                        onChange={(e) =>
                          setPassword({ ...password, new: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={password.confirm}
                        onChange={(e) =>
                          setPassword({ ...password, confirm: e.target.value })
                        }
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>My Events</CardTitle>
                <CardDescription>
                  Events you have registered for or attended
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendedEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                          <h3 
                            className="text-lg font-semibold mb-2 sm:mb-0 cursor-pointer" 
                            onClick={() => router.push(`/events/${event.id}`)}
                          >
                            {event.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <p
                              className={`text-xs p-2 rounded font-bold ${
                                getEventStatus(event) === "REGISTERED"
                                  ? "bg-green-400 text-green-700"
                                  : "bg-red-500 text-red-700"
                              }`}
                            >
                              {getEventStatus(event)}
                            </p>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedEventId(event.id);
                                setIsDialogOpen(true);
                              }}
                              disabled={loading}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                              {format(new Date(event.startDate), "PPP")}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                              {format(new Date(event.startDate), "p")} -{" "}
                              {format(new Date(event.endDate), "p")}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {attendedEvents.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      You haven&apos;t registered for any events yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Event Registration</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your registration for this event? 
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={loading}
              >
                No, keep my registration
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  selectedEventId && handleCancelAttendance(selectedEventId)
                }
                disabled={loading}
              >
                {loading ? "Canceling..." : "Yes, cancel registration"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}