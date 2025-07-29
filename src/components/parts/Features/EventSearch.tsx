// components/parts/Features/EventSearch.tsx
import React, { useState } from 'react';
import { Search, MapPin, Calendar, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EventSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const categories = [
    { value: 'conferences', label: 'Conferences' },
    { value: 'workshops', label: 'Workshops' },
    { value: 'networking', label: 'Networking' },
    { value: 'seminars', label: 'Seminars' },
    { value: 'webinars', label: 'Webinars' },
  ];

  const locations = [
    { value: 'newyork', label: 'New York' },
    { value: 'losangeles', label: 'Los Angeles' },
    { value: 'chicago', label: 'Chicago' },
    { value: 'miami', label: 'Miami' },
    { value: 'remote', label: 'Remote' },
  ];

  const quickFilters = [
    'This Weekend',
    'Free Events', 
    'Music',
    'Tech',
    'Food & Drink',
    'Online'
  ];

  const handleSearch = () => {
    console.log('Searching with:', { searchTerm, category, location });
  };

  const handleQuickFilter = (filter: string) => {
    console.log('Quick filter:', filter);
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
            <div className="grid gap-4 lg:grid-cols-[1fr,200px,200px,auto]">
              {/* Search Input */}
              <div className="relative search-input">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events, keywords, topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-muted/30 border-muted focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              {/* Category Select */}
              <div className="category-select">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 bg-muted/30 border-muted">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Select */}
              <div className="location-select">
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="h-12 bg-muted/30 border-muted">
                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.value} value={loc.value}>
                        {loc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
        .category-select,
        .location-select,
        .search-button {
          animation: fadeInUp 0.6s ease-out 0.5s both;
        }

        .category-select {
          animation-delay: 0.6s;
        }

        .location-select {
          animation-delay: 0.7s;
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