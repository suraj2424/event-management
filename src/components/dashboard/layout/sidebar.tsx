import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  CalendarPlus,
  Users,
  Settings,
  User,
  BarChart3,
  Ticket,
  Heart,
  Bell,
  Shield,
  UserCog,
} from "lucide-react";
import { UserRole } from "@/components/event-form/types/event";

interface SidebarProps {
  userRole: UserRole;
  onNavigate?: () => void;
}

const navigationItems = {
  [UserRole.ORGANIZER]: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "My Events",
      href: "/dashboard/events",
      icon: Calendar,
    },
    {
      title: "Create Event",
      href: "/dashboard/events/create",
      icon: CalendarPlus,
    },
    {
      title: "Attendees",
      href: "/dashboard/attendees",
      icon: Users,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
  ],
  [UserRole.ATTENDEE]: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "My Tickets",
      href: "/dashboard/tickets",
      icon: Ticket,
    },
    {
      title: "Favorite Events",
      href: "/dashboard/favorites",
      icon: Heart,
    },
    {
      title: "Browse Events",
      href: "/events",
      icon: Calendar,
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
    },
  ],
  [UserRole.ADMIN]: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "All Events",
      href: "/dashboard/events",
      icon: Calendar,
    },
    {
      title: "Users Management",
      href: "/dashboard/users",
      icon: UserCog,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: "System Settings",
      href: "/dashboard/settings",
      icon: Shield,
    },
  ],
};

const commonItems = [
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar({ userRole, onNavigate }: SidebarProps) {
  const router = useRouter();
  const roleBasedItems = navigationItems[userRole] || [];

  // Determine a single active href using the longest-matching rule.
  const allItems = [...roleBasedItems, ...commonItems];
  const pathname = router.pathname;
  const activeHref = React.useMemo(() => {
    const matches = allItems
      .map((i) => i.href)
      .filter((href) => {
        if (href === "/dashboard") return pathname === "/dashboard"; // exact only
        return pathname === href || pathname.startsWith(href + "/");
      })
      .sort((a, b) => b.length - a.length); // longest match wins
    return matches[0] || "";
  }, [pathname, allItems]);

  const isActive = (href: string) => href === activeHref;

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Logo/Brand */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">EVENZIA</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 border-r">
        <nav className="flex flex-col gap-2 p-4">
          {/* Role-based navigation */}
          <div className="space-y-1">
            {roleBasedItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start"
                  )}
                  asChild
                  onClick={onNavigate}
                >
                  <Link href={item.href}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              );
            })}
          </div>

          <Separator className="my-4" />

          {/* Common navigation */}
          <div className="space-y-1">
            {commonItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start"
                  )}
                  asChild
                  onClick={onNavigate}
                >
                  <Link href={item.href}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              );
            })}
          </div>
        </nav>
      </ScrollArea>
    </div>
  );
}