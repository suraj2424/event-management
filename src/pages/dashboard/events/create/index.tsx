import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EventForm } from "@/components/event-form/EventForm";

export default function CreateEventPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight">Create New Event</h1>
          <p className="text-muted-foreground mt-1 text-lg">Fill in the details to create and publish your event.</p>
        </div>

        <EventForm />
      </div>
    </DashboardLayout>
  );
}