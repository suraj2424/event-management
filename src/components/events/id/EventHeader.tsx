// components/events/EventsPageHeader.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import UserMenu from '../UserMenu';

const EventHeader: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container max-w-7xl mx-auto px-4 py-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button
          variant={'ghost'}
            onClick={() => router.back()} 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to homepage
          </Button>

          <div className="flex items-center gap-3">
            {session ? (
              <UserMenu />
            ) : (
              <Button 
                onClick={() => router.push("/signin")}
                size="sm"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default EventHeader;