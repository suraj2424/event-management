// components/parts/Features/Testimonials.tsx
import React, { forwardRef } from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Testimonials = forwardRef<HTMLDivElement>((props, ref) => {
  const testimonials = [
    {
      name: "Emily Johnson",
      role: "Event Planner",
      quote: "Evenzia has revolutionized how I handle events. The registration process is incredibly smooth, and the analytics tools provide invaluable insights that help me improve every event.",
      initials: "EJ",
      rating: 5,
    },
    {
      name: "Michael Torres",
      role: "Conference Organizer",
      quote: "The advanced features offered by Evenzia allowed us to scale our annual conference effortlessly. Attendee feedback was overwhelmingly positive and management was seamless.",
      initials: "MT",
      rating: 5,
    },
    {
      name: "Sarah Lee",
      role: "Marketing Director",
      quote: "I was amazed at how easy it was to find and register for events that matched my interests. The user-friendly interface made everything straightforward and enjoyable.",
      initials: "SL",
      rating: 5,
    },
  ];

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating 
              ? 'fill-foreground text-foreground' 
              : 'fill-muted text-muted'
          }`}
        />
      ))}
    </div>
  );

  return (
    <section 
      ref={ref}
      className="py-24 px-4 bg-background"
    >
      <div className="container max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 section-header">
          <Badge variant="secondary" className="mb-4">
            Testimonials
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Loved by{' '}
            <span className="text-muted-foreground">
              Event Professionals
            </span>
          </h2>
          
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            See what our users have to say about their experience with Evenzia
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group h-full border-0 bg-muted/20 hover:bg-muted/30 transition-all duration-500 hover:shadow-lg testimonial-card"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6 h-full flex flex-col">
                {/* Quote icon */}
                <div className="flex justify-between items-start mb-4">
                  <Quote className="w-8 h-8 text-muted-foreground/40" />
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Quote */}
                <blockquote className="text-foreground/90 mb-6 leading-relaxed text-sm flex-grow">
                  &quot;{testimonial.quote}&quot;
                </blockquote>

                {/* Author */}
                <div className="flex items-center mt-auto">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-4">
                    <span className="text-muted-foreground font-medium">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center trust-indicators">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-foreground text-foreground" />
              <span className="font-medium">4.9/5</span>
              <span>Average rating</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">500+</span> Reviews
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">10K+</span> Happy users
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-12 h-px bg-muted" />
            <span>Trusted by professionals worldwide</span>
            <div className="w-12 h-px bg-muted" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInCard {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .section-header {
          animation: fadeInUp 0.8s ease-out;
        }

        .testimonials-grid {
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }

        .testimonial-card {
          animation: slideInCard 0.6s ease-out both;
        }

        .trust-indicators {
          animation: fadeIn 1s ease-out 1.2s both;
        }
      `}</style>
    </section>
  );
});

Testimonials.displayName = "Testimonials";

export default Testimonials;