import React, { useState } from 'react';
import { Search, MapPin, Calendar, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";

const EventSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [isOpen, setIsOpen] = useState({ category: false, location: false });

  const categories = [
    { value: 'conferences', label: 'Conferences', icon: '🎯' },
    { value: 'workshops', label: 'Workshops', icon: '💡' },
    { value: 'networking', label: 'Networking', icon: '🤝' },
    { value: 'seminars', label: 'Seminars', icon: '📚' },
  ];

  const locations = [
    { value: 'newyork', label: 'New York', icon: '🗽' },
    { value: 'losangeles', label: 'Los Angeles', icon: '🌴' },
    { value: 'chicago', label: 'Chicago', icon: '🌆' },
    { value: 'miami', label: 'Miami', icon: '🏖' },
  ];

  const handleSearch = () => {
    console.log('Searching with:', { searchTerm, category, location });
  };

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-indigo-500 tracking-wide uppercase mb-3">
            Event Discovery
          </h2>
          <h3 className="text-4xl font-bold text-slate-900 mb-4">
            Find Your Perfect{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Event
            </span>
          </h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Discover amazing events happening around you. Use our powerful search to find exactly what you're looking for.
          </p>
        </div>

        {/* Search Container */}
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl -m-2 blur-xl" />

          {/* Search Form */}
          <div className="relative bg-white rounded-xl shadow-xl p-6">
            <div className="grid gap-4 md:grid-cols-[1fr,auto,auto,auto]">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-50 border border-slate-200 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                           transition-all duration-200"
                />
              </div>

              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsOpen(prev => ({ ...prev, category: !prev.category }))}
                  className="w-full md:w-auto px-4 py-3 rounded-lg bg-slate-50 border border-slate-200
                           flex items-center justify-between gap-2 hover:bg-slate-100 transition-colors"
                >
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">{category || 'Category'}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {isOpen.category && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-10">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => {
                          setCategory(cat.label);
                          setIsOpen(prev => ({ ...prev, category: false }));
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsOpen(prev => ({ ...prev, location: !prev.location }))}
                  className="w-full md:w-auto px-4 py-3 rounded-lg bg-slate-50 border border-slate-200
                           flex items-center justify-between gap-2 hover:bg-slate-100 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">{location || 'Location'}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {isOpen.location && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-10">
                    {locations.map((loc) => (
                      <button
                        key={loc.value}
                        onClick={() => {
                          setLocation(loc.label);
                          setIsOpen(prev => ({ ...prev, location: false }));
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                      >
                        <span>{loc.icon}</span>
                        <span>{loc.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 
                         text-white font-medium hover:opacity-90 transition-opacity
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {['This Weekend', 'Free Events', 'Music', 'Tech', 'Food'].map((filter) => (
            <button
              key={filter}
              className="px-4 py-1 rounded-full bg-slate-100 text-slate-600 text-sm
                       hover:bg-slate-200 transition-colors"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventSearch;