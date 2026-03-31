"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Calendar, CalendarPlus, Users, Settings, User,
  Ticket, Heart, Shield, UserCog, LayoutDashboard,
} from "lucide-react";
import { UserRole } from "@/components/event-form/types/event";

interface SidebarProps {
  userRole: UserRole;
  onNavigate?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navConfig = {
  [UserRole.ORGANIZER]: [
    { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { title: "My Events", href: "/dashboard/events", icon: Calendar },
    { title: "Create Event", href: "/dashboard/events/create", icon: CalendarPlus },
    { title: "Attendees", href: "/dashboard/attendees", icon: Users },
  ],
  [UserRole.ATTENDEE]: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "My Tickets", href: "/dashboard/tickets", icon: Ticket },
    { title: "Favorites", href: "/dashboard/favorites", icon: Heart },
    { title: "Browse Events", href: "/events", icon: Calendar },
  ],
  [UserRole.ADMIN]: [
    { title: "Admin Console", href: "/dashboard", icon: Shield },
    { title: "User Management", href: "/dashboard/users", icon: UserCog },
    { title: "Platform Events", href: "/dashboard/events", icon: Calendar },
    { title: "System Health", href: "/dashboard/settings", icon: Settings },
  ],
};

const commonNav = [
  { title: "Account Profile", href: "/dashboard/profile", icon: User },
  { title: "General Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ userRole, onNavigate }: SidebarProps) {
  const router = useRouter();
  const roleItems = navConfig[userRole] || [];

  const isActive = (href: string) => {
    // Exact match for dashboard home, prefix match for others
    if (href === "/dashboard") return router.pathname === "/dashboard";
    return router.pathname.startsWith(href);
  };

  const NavButton = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    
    return (
      <Button
        variant="ghost"
        className={cn(
          "w-full gap-3 px-3 py-6 transition-all duration-200 group",
          active 
            ? "bg-primary/10 text-primary hover:bg-primary/15 font-semibold" 
            : "text-muted-foreground hover:text-foreground"
        )}
        asChild
        onClick={onNavigate}
      >
        <Link href={item.href}>
          <item.icon className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
          )} />
          {item.title}
        </Link>
      </Button>
    );
  };

  return (
    <div className="flex h-full flex-col bg-card border-r shadow-sm">
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 border-b">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          onClick={onNavigate}
        >
          <div className="bg-primary p-1 rounded-lg">
            <Calendar className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-black tracking-tight text-xl italic uppercase">
            Evenzia
          </span>
        </Link>
      </div>

      {/* Navigation Area */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-3">
              Main Menu
            </p>
            <div className="space-y-1">
              {roleItems.map((item) => <NavButton key={item.href} item={item} />)}
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-3">
              Personal
            </p>
            <div className="space-y-1">
              {commonNav.map((item) => <NavButton key={item.href} item={item} />)}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer / Role Indicator */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex items-center gap-3 px-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground">Logged in as</span>
            <Badge variant="outline" className="mt-1 w-fit capitalize font-bold text-[10px] py-0">
              {userRole.toLowerCase()}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}