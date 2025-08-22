import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Camera, Save, CheckCircle, AlertCircle } from "lucide-react";
import { CustomSession, UserRole } from "../event-form/types/event";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function UserProfile() {
  const { data: session, update } = useSession() as {
    data: CustomSession | null;
    update: any;
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    role: UserRole;
    createdAt?: string;
    updatedAt?: string;
    stats?: {
      eventsCreated: number;
      totalAttendees: number;
      eventsAttended: number;
      upcomingEvents: number;
    };
  } | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSubmitting(true);
      setMessage(null);

      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      const response = await fetch(`${url}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          email: data.email,
        },
      });

      setMessage({ type: "success", text: "Profile updated successfully!" });
      // Refresh profile info after update
      await fetchProfile();
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to update profile" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${url}/api/user/profile`, { method: "GET" });
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      setProfile(data);
      // Reset form with fetched values (fallback to session if missing)
      form.reset({
        name: data?.name ?? session?.user?.name ?? "",
        email: data?.email ?? session?.user?.email ?? "",
      });
    } catch (e) {
      // Surface error but don't break the page
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Failed to load profile" });
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    // Fetch once session is available
    if (session) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          label: "Administrator",
        };
      case UserRole.ORGANIZER:
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          label: "Event Organizer",
        };
      case UserRole.ATTENDEE:
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          label: "Attendee",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          label: "User",
        };
    }
  };

  if (!session) return null;

  const roleConfig = getRoleConfig(session.user.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {message && (
        <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          {message.type === "error" ? (
            <AlertCircle className="h-4 w-4 text-red-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                  <AvatarFallback className="text-lg">
                    {getInitials(session.user.name)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">{profile?.name ?? session.user.name}</h3>
                <p className="text-sm text-muted-foreground">{profile?.email ?? session.user.email}</p>
                <Badge className={`${roleConfig.color} border`}>
                  {roleConfig.label}
                </Badge>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member since</span>
                <span>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last activity</span>
                <span>{profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "-"}</span>
              </div>
              {session.user.role === UserRole.ORGANIZER && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Events created</span>
                    <span>{loadingProfile ? "-" : profile?.stats?.eventsCreated ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total attendees</span>
                    <span>{loadingProfile ? "-" : profile?.stats?.totalAttendees ?? 0}</span>
                  </div>
                </>
              )}
              {session.user.role === UserRole.ATTENDEE && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Events attended</span>
                    <span>{loadingProfile ? "-" : profile?.stats?.eventsAttended ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Upcoming events</span>
                    <span>{loadingProfile ? "-" : profile?.stats?.upcomingEvents ?? 0}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Enter your email" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}