// components/header/MobileMenu.tsx
import React from 'react';
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Compass,
  LogIn,
  LayoutGrid,
  User,
  LogOut,
  Settings,
  CalendarRange,
} from "lucide-react";

interface MobileMenuProps {
  session: any;
  status: string;
  onFeaturesClick: () => void;
  onHowItWorksClick: () => void;
  onTestimonialsClick: () => void;
  onAboutClick: () => void;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  session,
  status,
  onFeaturesClick,
  onHowItWorksClick,
  onTestimonialsClick,
  onAboutClick,
  onClose,
}) => {
  const navItems = [
    { label: "Features", onClick: onFeaturesClick },
    { label: "How It Works", onClick: onHowItWorksClick },
    { label: "Testimonials", onClick: onTestimonialsClick },
    { label: "About", onClick: onAboutClick },
  ];

  const handleNavClick = (onClick: () => void) => {
    onClick();
    onClose();
  };

  return (
    <div className="mobile-menu md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container py-4 space-y-4">
        {/* Navigation Links */}
        <div className="space-y-1">
          {navItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.onClick)}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-muted-foreground 
                        hover:text-foreground hover:bg-muted rounded-md transition-colors mobile-nav-item"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start mobile-nav-item"
            style={{ animationDelay: '200ms' }}
            asChild
          >
            <Link href="/events" onClick={onClose}>
              <Compass className="w-4 h-4 mr-2" />
              Explore Events
            </Link>
          </Button>

          {status === "loading" ? (
            <Button variant="outline" className="w-full" disabled>
              <div className="w-4 h-4 border-2 border-muted border-t-foreground rounded-full animate-spin mr-2" />
              Loading...
            </Button>
          ) : session ? (
            <div className="space-y-2">
              {session.user?.role === "ORGANIZER" && (
                <Button
                  variant="outline"
                  className="w-full justify-start mobile-nav-item"
                  style={{ animationDelay: '250ms' }}
                  asChild
                >
                  <Link href="/manage-events" onClick={onClose}>
                    <CalendarRange className="w-4 h-4 mr-2" />
                    Manage Events
                  </Link>
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full justify-start mobile-nav-item"
                style={{ animationDelay: '300ms' }}
                asChild
              >
                <Link href="/profile" onClick={onClose}>
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start mobile-nav-item"
                style={{ animationDelay: '350ms' }}
                asChild
              >
                <Link href="/profile" onClick={onClose}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start mobile-nav-item"
                style={{ animationDelay: '400ms' }}
                asChild
              >
                <Link href="/profile/settings" onClick={onClose}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>

              <Separator />

              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive mobile-nav-item"
                style={{ animationDelay: '450ms' }}
                onClick={() => {
                  signOut();
                  onClose();
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              className="w-full mobile-nav-item"
              style={{ animationDelay: '250ms' }}
              asChild
            >
              <Link href="/signin" onClick={onClose}>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-menu {
          animation: slideDown 0.3s ease-out;
        }

        .mobile-nav-item {
          animation: slideDown 0.4s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default MobileMenu;