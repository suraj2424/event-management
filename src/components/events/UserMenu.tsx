// components/UserMenu.tsx
'use client';

import { useRouter } from 'next/router';

import { signOut, useSession } from 'next-auth/react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserMenu = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="hidden sm:block">
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const userInitials = user.name
    ? user.name
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email?.charAt(0).toUpperCase() || 'U';

  const handleSignOut = async () => {
    try {
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      onClick: () => router.push('/profile'),
      shortcut: '⌘P',
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => router.push('/profile/settings'),
      shortcut: '⌘,',
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 h-10 px-3 hover:bg-muted transition-all duration-200 group"
        >
          <Avatar className="h-8 w-8 transition-all duration-200 group-hover:scale-105">
            <AvatarImage 
              src={user.image || ''} 
              alt={user.name || 'User avatar'} 
            />
            <AvatarFallback className="bg-muted text-muted-foreground font-medium text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          
          {/* Desktop: Show name and chevron */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-foreground leading-none">
                {user.name?.split(' ')[0] || 'User'}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </div>

          {/* Mobile: Show only chevron */}
          <ChevronDown className="h-4 w-4 text-muted-foreground sm:hidden transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-64 p-2" 
        align="end" 
        sideOffset={8}
      >
        {/* User Info */}
        <DropdownMenuLabel className="p-3 bg-muted/50 rounded-lg mb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={user.image || ''} 
                alt={user.name || 'User avatar'} 
              />
              <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground leading-none truncate">
                {user.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground leading-none truncate">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        {menuItems.map(({ icon: Icon, label, onClick, shortcut }) => (
          <DropdownMenuItem 
            key={label}
            onClick={onClick}
            className="flex items-center justify-between p-3 rounded-md cursor-pointer focus:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{label}</span>
            </div>
            <span className="text-xs text-muted-foreground">{shortcut}</span>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {/* Sign Out */}
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="flex items-center gap-3 p-3 rounded-md cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Sign out</span>
        </DropdownMenuItem>

        {/* Footer */}
        <div className="mt-2 pt-2 border-t">
          <div className="text-center text-xs text-muted-foreground">
            EVENZIA • {new Date().getFullYear()}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;