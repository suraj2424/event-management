import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import EventList from '@/components/parts/EventList';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, ChevronLeft, ChevronRight, User, LogOut, Settings, Menu } from 'lucide-react';
import Link from 'next/link';

interface Event {
  id: number;
  title?: string;
  startDate?: string;
  endDate?: string;
  logo?: string;
  location?: string;
  description?: string;
  capacity?: number;
  status?: string;
  organizer?: string;
}

type EventType = 'all' | 'upcoming' | 'ongoing' | 'past';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [eventType, setEventType] = useState<EventType>('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const { data: session } = useSession();

  const eventsPerPage = 3;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/events?page=${currentPage}&limit=${eventsPerPage}&type=${eventType}`);

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        
        if (Array.isArray(data.events)) {
          setEvents(data.events);
          setTotalPages(data.totalPages || 1);
        } else {
          throw new Error('Invalid data structure received from API');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage, eventType]);

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {[...Array(eventsPerPage)].map((_, index) => (
        <div key={index} className="border rounded-lg overflow-hidden">
          <div className="relative h-40 w-full">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const filteredEvents = events.filter(event => {
    if (searchTerm === '') {
      return true;
    }
    return event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
  });

  const router = useRouter();

  const handleEventTypeChange = (type: EventType) => {
    setEventType(type);
    setCurrentPage(1);
    setIsFilterMenuOpen(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto mt-4 sm:mt-8 px-4">
      <div className='mb-5'>
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to homepage
        </Link>
      </div>
      {/* Top Bar with Search and User Profile */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <div className="w-full sm:w-1/3">
          <Input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                  <AvatarFallback>{session.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span onClick={()=>{ router.push("/profile") }}>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span onClick={()=>{ router.push("/profile/settings") }}>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={()=> { router.push("/signin") }}>Sign In</Button>
        )}
      </div>

      {/* Main Content */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Events</h1>

        {/* Event Filters */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="w-full sm:hidden mb-2"
          >
            <Menu className="mr-2 h-4 w-4" /> Filter Events
          </Button>
          <div className={`flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 ${isFilterMenuOpen ? '' : 'hidden sm:flex'}`}>
            <Button 
              variant={eventType === 'all' ? 'default' : 'outline'}
              onClick={() => handleEventTypeChange('all')}
              className="w-full sm:w-auto"
            >
              <Search className="mr-2 h-4 w-4" /> All Events
            </Button>
            <Button 
              variant={eventType === 'upcoming' ? 'default' : 'outline'}
              onClick={() => handleEventTypeChange('upcoming')}
              className="w-full sm:w-auto"
            >
              <Search className="mr-2 h-4 w-4" /> Upcoming
            </Button>
            <Button 
              variant={eventType === 'ongoing' ? 'default' : 'outline'}
              onClick={() => handleEventTypeChange('ongoing')}
              className="w-full sm:w-auto"
            >
              <Search className="mr-2 h-4 w-4" /> Ongoing
            </Button>
            <Button 
              variant={eventType === 'past' ? 'default' : 'outline'}
              onClick={() => handleEventTypeChange('past')}
              className="w-full sm:w-auto"
            >
              <Search className="mr-2 h-4 w-4" /> Past Events
            </Button>
          </div>
        </div>

        {loading && renderSkeletons()}
        
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!loading && !error && filteredEvents.length > 0 && <EventList events={filteredEvents} />}
        
        {!loading && !error && filteredEvents.length === 0 && (
          <Alert>
            <AlertTitle>No Events</AlertTitle>
            <AlertDescription>There are no events matching your criteria at this time.</AlertDescription>
          </Alert>
        )}

        {/* Pagination */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-10 space-y-4 sm:space-y-0">
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-full sm:w-auto"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-full sm:w-auto"
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;