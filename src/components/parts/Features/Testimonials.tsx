import React, { forwardRef } from 'react';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

const Testimonials = forwardRef<HTMLDivElement>((props, ref) => {
  const testimonials = [
    {
      name: "Emily Johnson",
      role: "Event Planner",
      quote: "Evenzia has revolutionized how I handle events. The registration process is incredibly smooth, and the analytics tools provide invaluable insights.",
      avatar: "/avatars/emily.jpg", // Add actual avatar images
      rating: 5,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      name: "Michael Torres",
      role: "Conference Organizer",
      quote: "The advanced features offered by Evenzia allowed us to scale our annual conference effortlessly. Attendee feedback was overwhelmingly positive.",
      avatar: "/avatars/michael.jpg",
      rating: 5,
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      name: "Sarah Lee",
      role: "Attendee",
      quote: "I was amazed at how easy it was to find and register for events that matched my interests. The user-friendly interface made everything straightforward!",
      avatar: "/avatars/sarah.jpg",
      rating: 5,
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <section 
      ref={ref}
      className="py-24 px-4 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-slate-50/50" />
      <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white to-transparent" />
      <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white to-transparent" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-sm font-semibold text-indigo-500 tracking-wide uppercase mb-3">
            Testimonials
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Loved by{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Event Professionals
            </span>
          </h3>
          <p className="max-w-2xl mx-auto text-lg text-slate-600">
            See what our users have to say about their experience with Evenzia
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group relative"
            >
              {/* Card */}
              <div className="relative p-8 bg-white rounded-2xl shadow-xl">
                {/* Gradient border effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${testimonial.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur`} />

                {/* Content */}
                <div className="relative z-10">
                  {/* Quote icon */}
                  <Quote className="w-10 h-10 text-slate-200 mb-6" />

                  {/* Rating */}
                  <div className="flex space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 fill-current bg-clip-text text-transparent bg-gradient-to-r ${testimonial.gradient}`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-slate-700 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
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