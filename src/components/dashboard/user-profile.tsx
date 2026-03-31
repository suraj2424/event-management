"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProfileData {
  name?: string;
  email?: string;
  role?: string;
  createdAt?: string;
  stats?: {
    eventsCreated?: number;
    totalAttendees?: number;
    eventsAttended?: number;
    upcomingEvents?: number;
  };
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Camera, Save, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { CustomSession } from "../event-form/types/event";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function UserProfile() {
  const { data: session, update } = useSession() as {
    data: CustomSession | null;
    update: (data?: Partial<CustomSession>) => Promise<CustomSession | null>;
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // Fetch Profile Data
  const fetchProfile = useCallback(async () => {
    try {
      // Use relative path for internal API routes
      const res = await fetch("/api/user/profile");
      if (!res.ok) throw new Error("Failed to load profile");

      const data = await res.json();
      setProfile(data);

      // Only reset if the user hasn't started typing yet
      if (!form.formState.isDirty) {
        form.reset({
          name: data?.name ?? session?.user?.name ?? "",
          email: data?.email ?? session?.user?.email ?? "",
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [session?.user, form]);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [fetchProfile, session?.user]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSubmitting(true);
      setMessage(null);

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      // Sync the client-side session with the new data
      await update({
        ...session,
        user: {
          id: session!.user!.id,
          name: data.name,
          email: data.email,
          image: session!.user!.image,
          role: session!.user!.role,
        },
      });

      setMessage({ type: "success", text: "Changes saved successfully!" });
      fetchProfile(); // Refresh stats/timestamps
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error instanceof Error ? error.message : "An unexpected error occurred" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name?: string | null) => {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  };

  if (!session) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your identity and view your activity stats.</p>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"} className={cn(
            message.type === "success" && "border-green-500 bg-green-500/10 text-green-600"
        )}>
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Col: Overview */}
        <Card className="md:col-span-4 h-fit">
          <CardContent className="pt-8 flex flex-col items-center">
            <div className="relative group">
              <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                <AvatarImage src={session.user.image || ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {getInitials(profile?.name || session.user.name)}
                </AvatarFallback>
              </Avatar>
              <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full shadow-md border h-9 w-9">
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 text-center space-y-1">
              <h3 className="text-xl font-bold">{profile?.name || session.user.name}</h3>
              <Badge variant="outline" className="capitalize px-3 py-0.5">
                {profile?.role?.toLowerCase() || session.user.role.toLowerCase()}
              </Badge>
            </div>

            <div className="w-full mt-8 space-y-4 pt-6 border-t">
               <StatItem label="Joined" value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Recent'} />
               {profile?.stats && (
                 <>
                   {session.user.role === 'ORGANIZER' ? (
                     <>
                        <StatItem label="Events Hosted" value={profile.stats.eventsCreated ?? 0} />
                        <StatItem label="Total Reach" value={profile.stats.totalAttendees ?? 0} />
                     </>
                   ) : (
                     <>
                        <StatItem label="Attended" value={profile.stats.eventsAttended ?? 0} />
                        <StatItem label="Upcoming" value={profile.stats.upcomingEvents ?? 0} />
                     </>
                   )}
                 </>
               )}
            </div>
          </CardContent>
        </Card>

        {/* Right Col: Edit Form */}
        <Card className="md:col-span-8">
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
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                          <Input type="email" readOnly className="bg-muted" {...field} />
                        </FormControl>
                        <FormDescription>Contact support to change your email.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSubmitting || !form.formState.isDirty} className="min-w-[140px]">
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
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

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function cn(...inputs: (string | undefined | null | false | 0)[]) {
    return inputs.filter(Boolean).join(" ");
}