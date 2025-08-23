import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "./loading-spinner";
import { SignInRequired, AccessDenied } from "./access-control";
import { DatePickerField } from "./date-picker-field";
import { FileUploadField } from "./file-upload-field";
import { SpecialGuestsSection } from "./special-guests-section";
import { SocialLinksSection } from "./social-links-section";
import { eventSchema, CustomSession, EventFormValues } from "./types/event";

export function EventForm() {
  const { data: session, status } = useSession() as { 
    data: CustomSession | null; 
    status: "authenticated" | "loading" | "unauthenticated" 
  };
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      location: "",
      capacity: 1,
      price: 0,
      currency: "USD",
      contactEmail: "",
      contactPhone: "",
      socialLinks: {
        facebook: "",
        twitter: "",
        instagram: "",
      },
      hostName: "",
      hostDescription: "",
      specialGuests: [
        {
          guestName: "",
          guestDescription: "",
        },
      ],
    },
  });

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (!session) {
    return <SignInRequired />;
  }

  if (session.user && session.user.role !== "ORGANIZER") {
    return <AccessDenied />;
  }

    const onSubmit = async (data: EventFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!session.user) {
        throw new Error("User session not found");
      }

      const payload = {
        ...data,
        organizerId: session.user.id,
        socialLinks: Object.keys(data.socialLinks || {}).reduce<
          Record<string, string>
        >((acc, k) => {
          const key = k as keyof typeof data.socialLinks;
          if (data.socialLinks[key]) {
            acc[k] = data.socialLinks[key];
          }
          return acc;
        }, {}),
      };

      const formData = new FormData();
      formData.append("eventData", JSON.stringify(payload));

      if (data.logo) {
        formData.append("logo", data.logo);
      }

      if (data.photos) {
        Array.from(data.photos).forEach((file) => {
          formData.append("photos", file as Blob);
        });
      }

    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      const response = await fetch(`${url}/api/events`, {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error?.message || "Failed to create event"
        );
      }

      router.push("/events");
    } catch (error) {
      console.error("Form submission error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to submit form"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter event description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <DatePickerField field={field} label="Start Date" />
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <DatePickerField field={field} label="End Date" />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Event location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Event capacity"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Pricing Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Price (0 for free event)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input placeholder="USD" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium border-b pb-2">Media</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FileUploadField
                      field={field}
                      label="Upload Logo"
                      accept="image/*"
                      multiple={false}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="photos"
                  render={({ field }) => (
                    <FileUploadField
                      field={field}
                      label="Upload Event Photos"
                      accept="image/*"
                      multiple={true}
                      icon={<ImageIcon className="mr-2 h-4 w-4" />}
                    />
                  )}
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium border-b pb-2">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="organizer@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Host Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium border-b pb-2">Host Information</h3>
              
              <FormField
                control={form.control}
                name="hostName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Host Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter host name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hostDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Host Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter host description" 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Special Guests Section */}
            <SpecialGuestsSection control={form.control} />

            {/* Social Links Section */}
            <SocialLinksSection control={form.control} />

            {/* Error Display */}
            {error && (
              <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-lg">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Creating Event..." : "Create Event"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}