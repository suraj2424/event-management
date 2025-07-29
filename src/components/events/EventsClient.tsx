// components/events/EventsClient.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter, X } from 'lucide-react';
import EventsPageHeader from './EventsPageHeader';
import EventsSearch from './EventsSearch';
import EventsFilters from './EventFilters';
import EventsGrid from './EventsGrid';
import EventsPagination from './EventsPagination';
import EventsEmptyState from './EventsEmptyState';
import EventsLoadingSkeleton from './EventsLoadingSkeleton';
import { EventsClientProps, EventType } from '@/types/events';

const EventsClient: React.FC<EventsClientProps> = ({ 
  initialEvents, 
  initialTotalPages, 
  initialError,
  initialPage,
  initialEventType,
  initialSearchTerm = ''
}) => {
  const searchParams = useSearchParams();
  
  // State management
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [eventType, setEventType] = useState<EventType>(initialEventType);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const eventsPerPage = 9;

  // Sync URL params with state
  useEffect(() => {
    const urlEventType = searchParams?.get('type') as EventType || 'all';
    const urlPage = parseInt(searchParams?.get('page') || '1');
    const urlSearch = searchParams?.get('search') || '';

    setEventType(urlEventType);
    setCurrentPage(urlPage);
    setSearchTerm(urlSearch);
  }, [searchParams]);

  // Filter events based on search term
  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) {
      return initialEvents;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return initialEvents.filter(event => 
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.location.toLowerCase().includes(searchLower) ||
      event.hostName.toLowerCase().includes(searchLower)
    );
  }, [initialEvents, searchTerm]);

  // Paginate filtered events
  const { paginatedEvents, totalFilteredPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const paginated = filteredEvents.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    
    return {
      paginatedEvents: paginated,
      totalFilteredPages: totalPages
    };
  }, [filteredEvents, currentPage, eventsPerPage]);

  const displayTotalPages = searchTerm.trim() ? totalFilteredPages : initialTotalPages;

  // Handle search with debouncing
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const handleSearchInput = (value: string) => {
    setSearchTerm(value);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      handleSearch(value);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  const handleSearch = (term: string) => {
    setIsLoading(true);
    
    const params = new URLSearchParams();
    params.set('type', eventType);
    params.set('page', '1');
    if (term.trim()) {
      params.set('search', term);
    }
    
    window.location.href = `/events?${params.toString()}`;
  };

  const handleEventTypeChange = (type: EventType) => {
    if (type !== eventType) {
      setIsLoading(true);
      
      const params = new URLSearchParams();
      params.set('type', type);
      params.set('page', '1');
      if (searchTerm.trim()) {
        params.set('search', searchTerm);
      }
      
      window.location.href = `/events?${params.toString()}`;
    }
    setIsMobileFiltersOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage) return;
    
    setIsLoading(true);
    
    const params = new URLSearchParams();
    params.set('type', eventType);
    params.set('page', newPage.toString());
    if (searchTerm.trim()) {
      params.set('search', searchTerm);
    }
    
    window.location.href = `/events?${params.toString()}`;
  };

  const handleClearSearch = () => {
    handleSearch('');
  };

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Filter Sidebar Component
  const FilterSidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`${isMobile ? 'p-6' : 'space-y-6'}`}>
      {isMobile && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileFiltersOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <EventsFilters
        eventType={eventType}
        onEventTypeChange={handleEventTypeChange}
        isOpen={true}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <EventsPageHeader />

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold text-foreground mb-6">Filters</h2>
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex flex-col gap-4 mb-6">
                {/* Title and Search Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      Discover Events
                    </h1>
                    <p className="text-muted-foreground">
                      Find and join amazing events happening around you
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Mobile Filter Toggle */}
                    <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="lg:hidden">
                          <Filter className="h-4 w-4 mr-2" />
                          Filters
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-80">
                        <FilterSidebar isMobile />
                      </SheetContent>
                    </Sheet>

                    <EventsSearch
                      searchTerm={searchTerm}
                      onSearchChange={handleSearchInput}
                    />
                  </div>
                </div>

                {/* Search Results Badge */}
                {searchTerm && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      Results for &quot;{searchTerm}&quot;
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {filteredEvents.length} events found
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearSearch}
                      className="h-6 px-2 text-xs"
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Events Content */}
            <div className="space-y-4">
              {isLoading ? (
                <EventsLoadingSkeleton count={eventsPerPage} />
              ) : initialError ? (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                  <AlertTitle className="text-destructive">Error Loading Events</AlertTitle>
                  <AlertDescription className="text-destructive/80">{initialError}</AlertDescription>
                </Alert>
              ) : paginatedEvents.length > 0 ? (
                <EventsGrid events={paginatedEvents} />
              ) : (
                <EventsEmptyState 
                  searchTerm={searchTerm} 
                  onClearSearch={searchTerm ? handleClearSearch : undefined}
                />
              )}

              {/* Pagination */}
              {!initialError && paginatedEvents.length > 0 && (
                <EventsPagination
                  currentPage={currentPage}
                  totalPages={displayTotalPages}
                  onPageChange={handlePageChange}
                  disabled={isLoading}
                />
              )}

              {/* Results Summary */}
              {!initialError && paginatedEvents.length > 0 && (
                <div className="text-center text-sm text-muted-foreground">
                  {searchTerm ? (
                    <p>
                      Showing {paginatedEvents.length} of {filteredEvents.length} events 
                      {filteredEvents.length !== initialEvents.length && 
                        ` (filtered from ${initialEvents.length} total)`
                      }
                    </p>
                  ) : (
                    <p>
                      Showing {((currentPage - 1) * eventsPerPage) + 1}-{Math.min(currentPage * eventsPerPage, initialEvents.length)} of {initialEvents.length} events
                    </p>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EventsClient;