// components/header/UserDropdown.tsx
import React from 'react';
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  CalendarRange,
  UserCircle,
  ChevronDown,
} from "lucide-react";

interface UserDropdownProps {
  session: any;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ session }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline"
          className="flex items-center gap-2 transition-all duration-200 hover:shadow-sm"
        >
          <UserCircle className="w-4 h-4" />
          <span className="hidden sm:inline">
            {session.user?.name?.split(' ')[0] || "Account"}
          </span>
          <ChevronDown className="w-3 h-3 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-56 animate-dropdown" 
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex items-center gap-2">
          <UserCircle className="h-4 w-4" />
          <span>My Account</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {session.user?.role === "ORGANIZER" ? (
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
              <CalendarRange className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>

      <style jsx>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out;
        }
      `}</style>
    </DropdownMenu>
  );
};

export default UserDropdown;