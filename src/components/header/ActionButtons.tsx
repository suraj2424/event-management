import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import UserDropdown from '@/components/header/UserDropdown';
import { ThemeToggle } from '../theme-toggle';

interface ActionButtonsProps {
  session: any;
  status: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ session, status }) => {
  return (
    <div className="hidden md:flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground"
        asChild
      >
        <Link href="/events" className="flex items-center gap-2">
          <Compass className="w-4 h-4" />
          Explore
        </Link>
      </Button>

      <ThemeToggle />

      {status === "loading" ? (
        <Button variant="outline" size="sm" disabled>
          <div className="w-4 h-4 border-2 border-muted border-t-foreground rounded-full animate-spin" />
        </Button>
      ) : session ? (
        <UserDropdown session={session} />
      ) : (
        <Button size="sm" asChild>
          <Link href="/signin">Sign In</Link>
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;