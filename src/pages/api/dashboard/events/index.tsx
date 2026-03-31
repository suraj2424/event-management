import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EventsManagement } from "@/components/dashboard/events-management";
import Head from "next/head";

export default function EventsPage() {
  return (
    <>
      <Head>
        <title>Manage Events | Evenzia</title>
      </Head>
      
      <DashboardLayout>
        {/* The EventsManagement component is passed as 'children' 
          to the DashboardLayout automatically here.
        */}
        <EventsManagement />
      </DashboardLayout>
    </>
  );
}