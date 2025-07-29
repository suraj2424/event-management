import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EventForm } from "@/components/event-form/EventForm";

export default function CreateEventPage() {
  return (
    <DashboardLayout>
      <EventForm />
    </DashboardLayout>
  );
}