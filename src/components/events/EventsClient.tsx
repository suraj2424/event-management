// components/events/EventsClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin
} from 'lucide-react';
import { EventsClientProps, EventType } from '@/types/events';

const EventsClient: React.FC<EventsClientProps> = ({ 
  initialEvents, 
  initialTotalPages, 
  initialError,
  initialPage,
  initialEventType,
  initialSearchTerm = ''
}) => {
  const router = useRouter();
  
  // State synced with Props (from SSR)
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isLoading, setIsLoading] = useState(false);

  // Global route change loading states
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleDone = () => setIsLoading(false);
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleDone);
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleDone);
    };
  }, [router.events]);

  // Update URL function
  const updateQuery = (updates: Record<string, string | number>) => {
    const newQuery = { ...router.query, ...updates };
    // Remove search if empty
    if (newQuery.search === '') delete newQuery.search;
    
    router.push({ pathname: '/events', query: newQuery }, undefined, { shallow: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ search: searchTerm, page: 1 });
  };

  const handleTypeChange = (type: EventType) => {
    updateQuery({ type, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateQuery({ page: newPage });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <div className="bg-foreground/[0.02] border-b border-foreground/5 pt-32 pb-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
                Discover <span className="text-primary">Events</span>
              </h1>
              <p className="text-muted-foreground mt-2 max-w-md">
                Find and join the most exclusive gatherings from our community.
              </p>
            </div>

            {/* Custom Search Bar */}
            <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events, hosts, locations..."
                className="w-full bg-background border border-foreground/10 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/5 transition-all"
              />
              {searchTerm && (
                <button 
                  type="button"
                  onClick={() => { setSearchTerm(''); updateQuery({ search: '', page: 1 }); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-8">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Status</h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {['all', 'upcoming', 'ongoing', 'past'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type as EventType)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                      initialEventType === type 
                        ? 'bg-foreground text-background border-foreground' 
                        : 'bg-transparent border-foreground/10 hover:border-foreground/30 text-muted-foreground'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid Content */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-[4/5] bg-foreground/5 rounded-[2.5rem]" />
                ))}
              </div>
            ) : initialError ? (
              <div className="p-12 text-center rounded-[2.5rem] bg-destructive/5 border border-destructive/10">
                <p className="text-destructive font-bold">{initialError}</p>
              </div>
            ) : initialEvents.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {initialEvents.map((event) => (
                    <div key={event.id} className="group relative bg-foreground/[0.02] border border-foreground/5 rounded-[2.5rem] overflow-hidden hover:border-foreground/10 transition-all p-6">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                          event.status === 'ONGOING' ? 'bg-emerald-500 text-white' : 'bg-foreground/10'
                        }`}>
                          {event.status}
                        </span>
                        <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {event.location}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-black tracking-tight mb-2 group-hover:italic transition-all">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
                        {event.description}
                      </p>

                      <div className="mt-auto pt-6 border-t border-foreground/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(event.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <button 
                                                  id="172"
                                                  onClick={() => router.push(`/events/${event.id}`)}
                                                  className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background hover:scale-110 transition-transform"
                                                >
                                                  <ChevronRight className="w-4 h-4" />
                                                </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom Pagination */}
                {initialTotalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-4">
                    <button 
                      disabled={initialPage <= 1}
                      onClick={() => handlePageChange(initialPage - 1)}
                      className="p-3 rounded-full border border-foreground/10 disabled:opacity-30 hover:bg-foreground/5"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-black italic">
                      {initialPage} / {initialTotalPages}
                    </span>
                    <button 
                      disabled={initialPage >= initialTotalPages}
                      onClick={() => handlePageChange(initialPage + 1)}
                      className="p-3 rounded-full border border-foreground/10 disabled:opacity-30 hover:bg-foreground/5"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center">
                <h3 className="text-2xl font-black italic mb-2">No events found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default EventsClient;