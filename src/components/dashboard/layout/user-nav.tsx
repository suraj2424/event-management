import React from "react";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal, // Added this
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { UserRole } from "@/components/event-form/types/event";

interface UserNavProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

const roleLabels: Record<string, string> = {
  [UserRole.ADMIN]: "Administrator",
  [UserRole.ORGANIZER]: "Event Organizer",
  [UserRole.ATTENDEE]: "Attendee",
};

export function UserNav({ user }: UserNavProps) {
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Added type="button" to prevent form submission triggers */}
        <Button variant="ghost" className="relative h-9 w-9 rounded-full outline-none">
          <Avatar className="h-9 w-9 border border-foreground/10">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuPortal>
        <DropdownMenuContent className="w-56" align="end" sideOffset={8} forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-tighter text-primary mt-1">
                {roleLabels[user.role] || user.role}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard/profile" className="flex w-full items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard/settings" className="flex w-full items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-red-500 focus:text-red-500"
            onSelect={(e) => {
              e.preventDefault();
              signOut({ callbackUrl: "/" });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}