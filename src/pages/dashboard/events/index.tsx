import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EventsManagement } from "@/components/dashboard/events-management";

export default function EventsPage() {
  return (
    <DashboardLayout>
      <EventsManagement />
    </DashboardLayout>
  );
}