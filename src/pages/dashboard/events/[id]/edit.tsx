import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerField } from "@/components/event-form/date-picker-field";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const EditEventSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional().default(""),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().min(1, "Required"),
  capacity: z.coerce.number().int().min(1),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  contactPhone: z.string().optional().or(z.literal("")),
  hostName: z.string().min(1, "Required"),
  hostDescription: z.string().optional().or(z.literal("")),
  price: z.coerce.number().min(0),
  currency: z.string().length(3),
});

type EditEventValues = z.infer<typeof EditEventSchema>;

type EventDTO = {
  id: number;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  contactEmail?: string | null;
  contactPhone?: string | null;
  hostName: string;
  hostDescription?: string | null;
  price?: number | null;
  currency?: string | null;
  logo?: string | null;
  photos?: string[] | null;
};

export default function EditEventPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<EventDTO | null>(null);

  const form = useForm<EditEventValues>({
    resolver: zodResolver(EditEventSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      location: "",
      capacity: 1,
      contactEmail: "",
      contactPhone: "",
      hostName: "",
      hostDescription: "",
      price: 0,
      currency: "USD",
    },
  });

  const canAccess = useMemo(() => {
    if (!session?.user) return false;
    // Must be organizer to access manage API
    return (session.user as any).role === "ORGANIZER";
  }, [session]);

  useEffect(() => {
    if (!id || !canAccess) return;
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const res = await fetch(`${url}/api/events/manage?id=${encodeURIComponent(id)}`, {
          credentials: "include",
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || `Failed to load event ${id}`);
        }
        const data = await res.json();
        const ev: EventDTO = data.event;
        setEvent(ev);
        // Prefill form fields
        form.reset({
          title: ev.title || "",
          description: ev.description || "",
          startDate: new Date(ev.startDate),
          endDate: new Date(ev.endDate),
          location: ev.location || "",
          capacity: ev.capacity ?? 1,
          contactEmail: ev.contactEmail || "",
          contactPhone: ev.contactPhone || "",
          hostName: ev.hostName || "",
          hostDescription: ev.hostDescription || "",
          price: ev.price ?? 0,
          currency: ev.currency || "USD",
        });
      } catch (e: any) {
        setError(e.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, canAccess]);

  const onSubmit = async (values: EditEventValues) => {
    if (!id) return;
    setSubmitting(true);
    setError(null);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${url}/api/events/manage`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: Number(id),
          title: values.title,
          description: values.description,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate.toISOString(),
          location: values.location,
          capacity: values.capacity,
          contactEmail: values.contactEmail,
          contactPhone: values.contactPhone,
          hostName: values.hostName,
          hostDescription: values.hostDescription,
          price: values.price,
          currency: values.currency,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update event");
      }
      // Go back to My Events
      router.push("/dashboard/events");
    } catch (e: any) {
      setError(e.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <DashboardLayout>
        <div className="p-8">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!session?.user || !canAccess) {
    return (
      <DashboardLayout>
        <div className="p-8">Unauthorized</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Event</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Event title" {...field} />
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
                        <Textarea className="min-h-[100px]" placeholder="Event description" {...field} />
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
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
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
                        <FormLabel>Currency (ISO, e.g., INR)</FormLabel>
                        <FormControl>
                          <Input placeholder="INR" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact / Host */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium border-b pb-2">Contact & Host</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="organizer@example.com" {...field} />
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
                          <Input placeholder="+91 98765 43210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="hostName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Host Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Host name" {...field} />
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
                        <Textarea className="min-h-[80px]" placeholder="Host details" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {error && (
                <div className="p-4 border border-destructive/20 bg-destructive/10 rounded">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
