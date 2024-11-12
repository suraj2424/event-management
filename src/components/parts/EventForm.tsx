import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CalendarIcon, Image, Upload } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  location: z.string().min(1, "Location is required"),
  capacity: z.coerce
    .number()
    .int()
    .positive("Capacity must be a positive integer"),
  logo: z.any().optional(),
  photos: z.any().optional(),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(1, "Phone number is required"),
  socialLinks: z.object({
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
  }),
  hostName: z.string().min(1, "Host name is required"),
  hostDescription: z.string().min(1, "Host description is required"),
  specialGuests: z
    .array(
      z.object({
        guestName: z.string(),
        guestDescription: z.string(),
      })
    )
    .optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export function EventForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [specialGuests, setSpecialGuests] = useState([
    { guestName: "", guestDescription: "" },
  ]);
  const { data: session, status } = useSession();
  const router = useRouter();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      location: "",
      capacity: 1,
      logo: null,
      photos: [],
      contactEmail: "",
      contactPhone: "",
      socialLinks: {
        facebook: "",
        twitter: "",
        instagram: "",
      },
      hostName: "",
      hostDescription: "",
      specialGuests: [{ guestName: "", guestDescription: "" }],
    },
  });

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Sign In Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-red-500">
            You must be signed in to create an event.
          </p>
          <Button onClick={() => router.push("/auth/organizer/signin")}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (session.user.role !== "ORGANIZER") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-red-500">Only organizers can create events.</p>
        </CardContent>
      </Card>
    );
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const files = e.target.files;
    if (files) {
      if (field.name === "logo") {
        field.onChange(files[0]);
      } else {
        field.onChange(files);
      }
    }
  };

  const onSubmit = async (data: EventFormValues) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
  
      // Add basic fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("startDate", data.startDate.toISOString());
      formData.append("endDate", data.endDate.toISOString());
      formData.append("location", data.location);
      formData.append("capacity", data.capacity.toString());
      formData.append("contactEmail", data.contactEmail);
      formData.append("contactPhone", data.contactPhone || "");
      formData.append("hostName", data.hostName);
      formData.append("hostDescription", data.hostDescription || "");
  
      // Convert objects to JSON strings before appending
      formData.append("socialLinks", JSON.stringify({
        facebook: data.socialLinks.facebook || "",
        twitter: data.socialLinks.twitter || "",
        instagram: data.socialLinks.instagram || ""
      }));
  
      // Filter out empty special guests and convert to JSON
      const validSpecialGuests = specialGuests.filter(
        guest => guest.guestName.trim() !== "" || guest.guestDescription.trim() !== ""
      );
      formData.append("specialGuests", JSON.stringify(validSpecialGuests));
  
      // Handle file uploads
      if (data.logo) {
        formData.append("logo", data.logo);
      }
  
      if (data.photos) {
        Array.from(data.photos).forEach((file) => {
          formData.append("photos", file);
        });
      }
  
      // Make sure organizerId is included
      if (session?.user?.id) {
        formData.append("organizerId", session.user.id);
      }
  
      const response = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to create event");
      }

      router.push("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      alert(error.message || "Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  const addGuest = () => {
    setSpecialGuests([
      ...specialGuests,
      { guestName: "", guestDescription: "" },
    ]);
  };

  const removeGuest = (index: number) => {
    const updatedGuests = specialGuests.filter((_, i) => i !== index);
    setSpecialGuests(updatedGuests);
  };

  const handleGuestChange = (
    index: number,
    field: "guestName" | "guestDescription",
    value: string
  ) => {
    const updatedGuests = [...specialGuests];
    updatedGuests[index][field] = value;
    setSpecialGuests(updatedGuests);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Logo</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("logo-upload")?.click()
                        }
                      >
                        <Upload className="mr-2 h-4 w-4" /> Choose Logo
                      </Button>
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, field)}
                      />
                      {field.value && (
                        <span className="text-sm text-muted-foreground">
                          {field.value.name}
                        </span>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Event Photos</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("photos-upload")?.click()
                        }
                      >
                        <Image className="mr-2 h-4 w-4" /> Choose Photos
                      </Button>
                      <Input
                        id="photos-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileChange(e, field)}
                      />
                      {field.value && field.value.length > 0 && (
                        <span className="text-sm text-muted-foreground">
                          {field.value.length} photo(s) selected
                        </span>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Organizer's contact email"
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
                    <Input placeholder="Organizer's contact phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Textarea placeholder="Enter host description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Special Guests</h3>
                <Button type="button" variant="outline" onClick={addGuest}>
                  Add Guest
                </Button>
              </div>

              {specialGuests.map((guest, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Guest #{index + 1}</h4>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeGuest(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FormLabel>Guest Name</FormLabel>
                      <Input
                        placeholder="Enter guest name"
                        value={guest.guestName}
                        onChange={(e) =>
                          handleGuestChange(index, "guestName", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <FormLabel>Guest Description</FormLabel>
                      <Textarea
                        placeholder="Enter guest description"
                        value={guest.guestDescription}
                        onChange={(e) =>
                          handleGuestChange(
                            index,
                            "guestDescription",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Links</h3>
              <FormField
                control={form.control}
                name="socialLinks.facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Facebook page URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="socialLinks.twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Twitter profile URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="socialLinks.instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Instagram profile URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
