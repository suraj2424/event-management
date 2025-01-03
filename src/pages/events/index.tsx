// import React, { useState, useEffect } from 'react';
// import { useSession, signOut } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import EventList from '@/components/parts/EventList';
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Search, ChevronLeft, ChevronRight, User, LogOut, Settings, Menu } from 'lucide-react';
// import Link from 'next/link';

// interface Event {
//   id: number;
//   title?: string;
//   startDate?: string;
//   endDate?: string;
//   logo?: string;
//   location?: string;
//   description?: string;
//   capacity?: number;
//   status?: string;
//   organizer?: string;
// }

// type EventType = 'all' | 'upcoming' | 'ongoing' | 'past';

// const EventsPage: React.FC = () => {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [eventType, setEventType] = useState<EventType>('all');
//   const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
//   const { data: session } = useSession();

//   const eventsPerPage = 3;

//   useEffect(() => {
//     const fetchEvents = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(`/api/events?page=${currentPage}&limit=${eventsPerPage}&type=${eventType}`);

//         if (!response.ok) {
//           throw new Error('Failed to fetch events');
//         }

//         const data = await response.json();
        
//         if (Array.isArray(data.events)) {
//           setEvents(data.events);
//           setTotalPages(data.totalPages || 1);
//         } else {
//           throw new Error('Invalid data structure received from API');
//         }
//       } catch (error) {
//         setError(error instanceof Error ? error.message : 'An unknown error occurred');
//         setEvents([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, [currentPage, eventType]);

//   const renderSkeletons = () => (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//       {[...Array(eventsPerPage)].map((_, index) => (
//         <div key={index} className="border rounded-lg overflow-hidden">
//           <div className="relative h-40 w-full">
//             <Skeleton className="h-full w-full" />
//           </div>
//           <div className="p-4">
//             <Skeleton className="h-6 w-3/4 mb-2" />
//             <Skeleton className="h-4 w-full mb-4" />
//             <div className="space-y-2">
//               <Skeleton className="h-4 w-1/4" />
//               <Skeleton className="h-4 w-1/2" />
//               <Skeleton className="h-4 w-1/3" />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   const filteredEvents = events.filter(event => {
//     if (searchTerm === '') {
//       return true;
//     }
//     return event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
//   });

//   const router = useRouter();

//   const handleEventTypeChange = (type: EventType) => {
//     setEventType(type);
//     setCurrentPage(1);
//     setIsFilterMenuOpen(false);
//   };

//   return (
//     <div className="max-w-[1400px] mx-auto mt-4 sm:mt-8 px-4">
//       <div className='mb-5'>
//         <Link 
//           href="/" 
//           className="inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
//         >
//           <ChevronLeft className="mr-2 h-4 w-4" />
//           Back to homepage
//         </Link>
//       </div>
//       {/* Top Bar with Search and User Profile */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
//         <div className="w-full sm:w-1/3">
//           <Input
//             type="text"
//             placeholder="Search events..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full"
//           />
//         </div>
//         {session ? (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                 <Avatar className="h-8 w-8">
//                   <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
//                   <AvatarFallback>{session.user?.name?.charAt(0) || 'U'}</AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-56" align="end" forceMount>
//               <DropdownMenuLabel className="font-normal">
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium leading-none">{session.user?.name}</p>
//                   <p className="text-xs leading-none text-muted-foreground">
//                     {session.user?.email}
//                   </p>
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>
//                 <User className="mr-2 h-4 w-4" />
//                 <span onClick={()=>{ router.push("/profile") }}>Profile</span>
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <Settings className="mr-2 h-4 w-4" />
//                 <span onClick={()=>{ router.push("/profile/settings") }}>Settings</span>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => signOut()}>
//                 <LogOut className="mr-2 h-4 w-4" />
//                 <span>Log out</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         ) : (
//           <Button onClick={()=> { router.push("/signin") }}>Sign In</Button>
//         )}
//       </div>

//       {/* Main Content */}
//       <div>
//         <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Events</h1>

//         {/* Event Filters */}
//         <div className="mb-6">
//           <Button
//             variant="outline"
//             onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
//             className="w-full sm:hidden mb-2"
//           >
//             <Menu className="mr-2 h-4 w-4" /> Filter Events
//           </Button>
//           <div className={`flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 ${isFilterMenuOpen ? '' : 'hidden sm:flex'}`}>
//             <Button 
//               variant={eventType === 'all' ? 'default' : 'outline'}
//               onClick={() => handleEventTypeChange('all')}
//               className="w-full sm:w-auto"
//             >
//               <Search className="mr-2 h-4 w-4" /> All Events
//             </Button>
//             <Button 
//               variant={eventType === 'upcoming' ? 'default' : 'outline'}
//               onClick={() => handleEventTypeChange('upcoming')}
//               className="w-full sm:w-auto"
//             >
//               <Search className="mr-2 h-4 w-4" /> Upcoming
//             </Button>
//             <Button 
//               variant={eventType === 'ongoing' ? 'default' : 'outline'}
//               onClick={() => handleEventTypeChange('ongoing')}
//               className="w-full sm:w-auto"
//             >
//               <Search className="mr-2 h-4 w-4" /> Ongoing
//             </Button>
//             <Button 
//               variant={eventType === 'past' ? 'default' : 'outline'}
//               onClick={() => handleEventTypeChange('past')}
//               className="w-full sm:w-auto"
//             >
//               <Search className="mr-2 h-4 w-4" /> Past Events
//             </Button>
//           </div>
//         </div>

//         {loading && renderSkeletons()}
        
//         {error && (
//           <Alert variant="destructive">
//             <AlertTitle>Error</AlertTitle>
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}
        
//         {!loading && !error && filteredEvents.length > 0 && <EventList events={filteredEvents} />}
        
//         {!loading && !error && filteredEvents.length === 0 && (
//           <Alert>
//             <AlertTitle>No Events</AlertTitle>
//             <AlertDescription>There are no events matching your criteria at this time.</AlertDescription>
//           </Alert>
//         )}

//         {/* Pagination */}
//         {!loading && !error && filteredEvents.length > 0 && (
//           <div className="flex flex-col sm:flex-row justify-between items-center mt-10 space-y-4 sm:space-y-0">
//             <Button 
//               variant="outline" 
//               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="w-full sm:w-auto"
//             >
//               <ChevronLeft className="mr-2 h-4 w-4" /> Previous
//             </Button>
//             <span className="text-sm">Page {currentPage} of {totalPages}</span>
//             <Button 
//               variant="outline" 
//               onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//               disabled={currentPage === totalPages}
//               className="w-full sm:w-auto"
//             >
//               Next <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EventsPage;


























import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
import { 
  Search, ChevronLeft, ChevronRight, User, LogOut, 
  Settings, Menu, Calendar, Clock, History 
} from 'lucide-react';
import Link from 'next/link';

// Types remain the same
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

// Separate components for better organization
const UserMenu = ({ session, router }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-slate-100 hover:ring-slate-200">
        <Avatar className="h-10 w-10">
          <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
          <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            {session.user?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="end" forceMount>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{session.user?.name}</p>
          <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => router.push("/profile")}>
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => router.push("/profile/settings")}>
        <Settings className="mr-2 h-4 w-4" />
        <span>Settings</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem 
        onClick={() => signOut()}
        className="text-red-600 focus:text-red-600"
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const EventFilters = ({ eventType, handleEventTypeChange, isFilterMenuOpen }) => {
  const filters = [
    { type: 'all', label: 'All Events', Icon: Search },
    { type: 'upcoming', label: 'Upcoming', Icon: Calendar },
    { type: 'ongoing', label: 'Ongoing', Icon: Clock },
    { type: 'past', label: 'Past Events', Icon: History },
  ];

  return (
    <div className={`flex flex-col sm:flex-row gap-2 ${isFilterMenuOpen ? '' : 'hidden sm:flex'}`}>
      {filters.map(({ type, label, Icon }) => (
        <Button
          key={type}
          variant={eventType === type ? 'default' : 'outline'}
          onClick={() => handleEventTypeChange(type)}
          className={`
            relative w-full sm:w-auto overflow-hidden group
            ${eventType === type ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90' : ''}
          `}
        >
          <Icon className="mr-2 h-4 w-4" />
          {label}
          {eventType === type && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </Button>
      ))}
    </div>
  );
};

// Continue in part 2...


// ... continuing from part 1

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
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Back Button */}
            <Link 
              href="/" 
              className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to homepage
            </Link>

            {/* Search and User Profile */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-slate-200"
                />
              </div>
              
              {session ? (
                <UserMenu session={session} router={router} />
              ) : (
                <Button 
                  onClick={() => router.push("/signin")}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Discover Events
          </h1>
          <p className="text-slate-600">
            Find and join amazing events happening around you
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="w-full sm:hidden mb-4"
          >
            <Menu className="mr-2 h-4 w-4" />
            Filter Events
          </Button>
          <EventFilters
            eventType={eventType}
            handleEventTypeChange={handleEventTypeChange}
            isFilterMenuOpen={isFilterMenuOpen}
          />
        </div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {renderSkeletons()}
            </motion.div>
          ) : error ? (
            <Alert variant="destructive" className="bg-red-50 border border-red-100">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredEvents.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <EventList events={filteredEvents} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 mx-auto mb-6">
                <Calendar className="w-full h-full text-slate-200" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No events found
              </h3>
              <p className="text-slate-600">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {!loading && !error && filteredEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-4"
          >
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-full sm:w-auto group"
            >
              <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Previous
            </Button>
            
            <span className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-full sm:w-auto group"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default EventsPage;