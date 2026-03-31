import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Sidebar } from "./layout/sidebar";
import { UserNav } from "./layout/user-nav";
import { CustomSession } from "@/components/event-form/types/event";
import { LoadingSpinner } from "../event-form/loading-spinner";
import { ThemeToggle } from "../theme-toggle";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: string };
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") return <LoadingSpinner />;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Nav */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-40">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon"><Menu /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar userRole={session.user.role} onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="font-bold">EVENZIA</span>
        <UserNav user={session.user} />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <Sidebar userRole={session.user.role} />
      </aside>

      <div className="md:pl-64 flex flex-col">
        {/* Desktop Topbar */}
        <header className="hidden md:flex sticky top-0 z-30 h-16 items-center justify-end gap-4 border-b bg-background px-8">
          <ThemeToggle />
          <UserNav user={session.user} />
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}