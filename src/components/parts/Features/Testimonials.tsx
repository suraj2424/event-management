import React, { forwardRef } from 'react';
import { Star } from 'lucide-react';

const Testimonials = forwardRef<HTMLDivElement>((props, ref) => {
  const testimonials = [
    {
      name: "Emily Johnson",
      role: "Event Planner",
      quote: "Evenzia has revolutionized how I handle events. The registration process is incredibly smooth, and the analytics tools provide invaluable insights.",
    },
    {
      name: "Michael Torres",
      role: "Conference Organizer",
      quote: "The advanced features offered by Evenzia allowed us to scale our annual conference effortlessly. Attendee feedback was overwhelmingly positive.",
    },
    {
      name: "Sarah Lee",
      role: "Attendee",
      quote: "I was amazed at how easy it was to find and register for events that matched my interests. The user-friendly interface made everything straightforward!",
    },
  ];

  return (
    <section 
      id="testimonials"
      ref={ref} 
      className="py-16 px-4 md:px-20"
    >
      <div className="max-w-6xl mx-auto">
        <h2 
          className="text-4xl md:text-5xl font-bold text-center mb-12 
          text-white tracking-tight leading-tight 
          hover:text-cyan-400 transition-colors duration-300"
        >
          What Our Users Are Saying
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl 
              bg-zinc-900/50 backdrop-blur-lg 
              border border-zinc-800 
              hover:border-cyan-400 
              transition-all duration-500 
              transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <Star 
                className="w-8 h-8 text-yellow-400 mb-4 
                group-hover:rotate-12 transition-transform duration-300"
              />
              <p 
                className="mb-4 text-sm text-slate-400 
                group-hover:text-white 
                transition-colors duration-300"
              >
                {testimonial.quote}
              </p>
              <div 
                className="font-bold text-white 
                group-hover:text-cyan-400 
                transition-colors duration-300"
              >
                {testimonial.name}
              </div>
              <div 
                className="text-sm text-zinc-500 
                group-hover:text-slate-300 
                transition-colors duration-300"
              >
                {testimonial.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

Testimonials.displayName = "Testimonials";

export default Testimonials;