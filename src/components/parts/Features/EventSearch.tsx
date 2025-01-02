import React, { useState } from 'react';
import { Search } from 'lucide-react';

const EventSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const categories = [
    { value: 'conferences', label: 'Conferences' },
    { value: 'workshops', label: 'Workshops' },
    { value: 'networking', label: 'Networking' }
  ];

  const locations = [
    { value: 'newyork', label: 'New York' },
    { value: 'losangeles', label: 'Los Angeles' },
    { value: 'chicago', label: 'Chicago' }
  ];

  const handleSearch = () => {
    // Implement search logic here
    console.log('Searching with:', { searchTerm, category, location });
  };

  return (
    <section 
      id="event-search" 
      className="py-16 px-4 md:px-20 max-w-xl mx-auto"
    >
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 
            className="text-2xl md:text-3xl font-bold mb-3 
            transition-colors duration-300 hover:text-cyan-400"
          >
            Find Your Next Event
          </h3>
          <p 
            className="text-slate-700 text-base 
            opacity-70 hover:opacity-100 transition-opacity"
          >
            Search for events by keyword, category, or location
          </p>
        </div>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 px-4 rounded-sm 
            bg-zinc-50 
            border border-zinc-200 
            focus:outline-none focus:ring-2 focus:ring-cyan-400 
            transition-all duration-300 selection:text-white tracking-wide
            placeholder-slate-400"
          />
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full py-3 px-4 rounded-sm
            bg-zinc-50 
            border border-zinc-200 
            focus:outline-none focus:ring-2 focus:ring-cyan-400 
            transition-all duration-300"
          >
            <option value="" className="">Category</option>
            {categories.map((cat) => (
              <option 
                key={cat.value} 
                value={cat.value}
                className=""
              >
                {cat.label}
              </option>
            ))}
          </select>
          
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full py-3 px-4 rounded-sm
            bg-zinc-50
            border border-zinc-200 
            focus:outline-none focus:ring-2 focus:ring-cyan-400 
            transition-all duration-300"
          >
            <option value="" className="">Location</option>
            {locations.map((loc) => (
              <option 
                key={loc.value} 
                value={loc.value}
                className=""
              >
                {loc.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleSearch}
            className="w-full py-3 px-6 rounded-full 
            bg-cyan-400 text-white 
            font-bold 
            hover:bg-cyan-500 
            transition-all duration-150 ease-in-out 
            flex items-center justify-center 
            space-x-2 
            active:scale-95"
          >
            <Search className="w-5 h-5" />
            <span>Search Events</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventSearch;