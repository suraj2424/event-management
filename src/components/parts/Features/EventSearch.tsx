// components/parts/Features/EventSearch.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { Search, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const EventSearch = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  // removed category/location to simplify search UX

  // Inline suggestions state
  const [suggestions, setSuggestions] = useState<Array<{ id: number; title: string; startDate?: string; location?: string; logo?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [openSuggestions, setOpenSuggestions] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);

  // removed category/location lists

  const quickFilters = [
    'This Weekend',
    'Free Events', 
    'Music',
    'Tech',
    'Food & Drink',
    'Online'
  ];

  const handleSearch = () => {
    const term = searchTerm.trim();
    const query = new URLSearchParams();
    query.set('type', 'all');
    query.set('page', '1');
    if (term) query.set('search', term);
    // Note: category/location are not yet supported by /events SSR filters,
    // so we only pass `search`. We can extend the SSR later to support them.
    router.push(`/events?${query.toString()}`);
  };

  const handleQuickFilter = (filter: string) => {
    const query = new URLSearchParams();
    query.set('type', 'all');
    query.set('page', '1');
    query.set('search', filter);
    router.push(`/events?${query.toString()}`);
  };

  // Debounced suggestions fetcher
  useEffect(() => {
    const term = searchTerm.trim();

    // Clear previous debounce
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    if (!term) {
      setSuggestions([]);
      setOpenSuggestions(false);
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      // Abort previous request
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      try {
        const params = new URLSearchParams({ search: term, limit: '5', type: 'all', page: '1' });
        const res = await fetch(`/api/events?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        const list = Array.isArray(data?.events) ? data.events : [];
        setSuggestions(
          list.map((e: any) => ({
            id: e.id,
            title: e.title,
            startDate: e.startDate,
            location: e.location,
            logo: e.logo,
          }))
        );
        setOpenSuggestions(true);
      } catch (err) {
        if ((err as any)?.name !== 'AbortError') {
          setSuggestions([]);
          setOpenSuggestions(false);
        }
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);

  const handleSelectSuggestion = (id: number) => {
    setOpenSuggestions(false);
    router.push(`/events/${id}`);
  };

  return (
    <section className="py-24 px-4 bg-muted/20">
      <div className="container max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 section-header">
          <Badge variant="secondary" className="mb-4">
            Event Discovery
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Find Your Perfect{' '}
            <span className="text-muted-foreground">
              Event
            </span>
          </h2>
          
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover amazing events happening around you. Use our powerful search to find exactly what you&apos;re looking for.
          </p>
        </div>

        {/* Search Container */}
        <Card className="search-card border-0 shadow-lg bg-background/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr,auto]">
              {/* Search Input */}
              <div className="relative search-input">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events, keywords, topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  className="pl-10 h-12 bg-muted/30 border-muted focus-visible:ring-1 focus-visible:ring-ring"
                />

                {/* Suggestions dropdown */}
                {openSuggestions && (
                  <div className="absolute z-20 mt-2 w-full rounded-md border bg-popover text-popover-foreground shadow">
                    {loading && (
                      <div className="px-4 py-3 text-sm text-muted-foreground">Searching…</div>
                    )}
                    {!loading && suggestions.length === 0 && (
                      <div className="px-4 py-3 text-sm text-muted-foreground">No results</div>
                    )}
                    {!loading && suggestions.length > 0 && (
                      <ul className="max-h-80 overflow-auto">
                        {suggestions.map((s) => (
                          <li
                            key={s.id}
                            className="px-4 py-3 hover:bg-muted cursor-pointer flex items-center gap-3"
                            onClick={() => handleSelectSuggestion(s.id)}
                          >
                            {s.logo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={s.logo} alt="logo" className="w-8 h-8 rounded object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded bg-muted" />
                            )}
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">{s.title}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {s.location || 'Location TBA'}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              

              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                className="h-12 px-8 search-button"
                size="lg"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="mt-4 pt-4 border-t border-muted">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground"
              >
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Filters */}
        <div className="mt-8 quick-filters">
          <div className="text-center mb-4">
            <span className="text-sm text-muted-foreground">Popular searches:</span>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {quickFilters.map((filter, index) => (
              <Badge
                key={filter}
                variant="secondary"
                className="cursor-pointer hover:bg-muted transition-colors duration-200 quick-filter-badge"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleQuickFilter(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 stats-grid">
          {[
            { number: '10K+', label: 'Events' },
            { number: '50+', label: 'Cities' },
            { number: '100K+', label: 'Attendees' },
            { number: '500+', label: 'Organizers' },
          ].map((stat, index) => (
            <div 
              key={stat.label} 
              className="text-center p-4 rounded-lg bg-background/60 backdrop-blur-sm border stat-item"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-2xl font-bold text-foreground">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeInStagger {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .section-header {
          animation: fadeInUp 0.8s ease-out;
        }

        .search-card {
          animation: slideInScale 0.8s ease-out 0.3s both;
        }

        .search-input,
        .search-button {
          animation: fadeInUp 0.6s ease-out 0.5s both;
        }

        .search-button {
          animation-delay: 0.8s;
        }

        .quick-filters {
          animation: fadeInUp 0.8s ease-out 0.9s both;
        }

        .quick-filter-badge {
          animation: fadeInStagger 0.5s ease-out both;
        }

        .stats-grid {
          animation: fadeInUp 0.8s ease-out 1.1s both;
        }

        .stat-item {
          animation: fadeInStagger 0.6s ease-out both;
        }
      `}</style>
    </section>
  );
};

export default EventSearch;