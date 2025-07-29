// components/parts/Features/HowItWorks.tsx
import React, { forwardRef } from 'react';
import { Search, Calendar, Settings } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HowItWorks = forwardRef<HTMLDivElement>((props, ref) => {
  const steps = [
    {
      icon: Search,
      title: "Explore Events",
      description: "Browse through a wide range of events categorized by interest, date, and location with our intelligent search system.",
      step: "01",
    },
    {
      icon: Calendar,
      title: "Register Effortlessly",
      description: "Complete your registration in minutes. Fill in your details, choose your ticket, and you're ready to go.",
      step: "02",
    },
    {
      icon: Settings,
      title: "Manage Your Experience",
      description: "Access your personalized dashboard to manage orders and receive real-time updates about your events.",
      step: "03",
    },
  ];

  return (
    <section 
      ref={ref}
      className="py-24 px-4 relative bg-background"
    >
      <div className="container max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 section-header">
          <Badge variant="secondary" className="mb-4">
            How It Works
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Get Started in{' '}
            <span className="text-muted-foreground">
              Three Simple Steps
            </span>
          </h2>
          
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            We&apos;ve simplified the event management process so you can focus on what matters most
          </p>
        </div>

        {/* Steps container */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-px bg-border z-0">
            <div className="absolute left-1/6 top-0 w-2/3 h-px bg-muted-foreground/20" />
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 steps-grid">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative step-item"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <Card className="group h-full border-0 bg-background hover:bg-muted/20 transition-all duration-500 hover:shadow-lg">
                  <CardContent className="p-8 relative">
                    {/* Step number background */}
                    <div className="absolute top-6 right-6 text-6xl font-bold text-muted/10 group-hover:text-muted/20 transition-colors duration-300">
                      {step.step}
                    </div>

                    {/* Icon with step indicator */}
                    <div className="relative mb-8">
                      <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors duration-300">
                        {React.createElement(step.icon, {
                          className: "w-7 h-7 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                        })}
                      </div>
                      
                      {/* Step number badge */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-foreground text-background text-sm font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-foreground/90 transition-colors">
                      {step.title}
                    </h3>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {step.description}
                    </p>

                    {/* Action indicator */}
                    <div className="flex items-center text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <span>Learn more</span>
                      <svg
                        className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </CardContent>
                </Card>

                {/* Mobile connection indicator */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-6 mb-2">
                    <div className="w-px h-8 bg-border" />
                    <div className="absolute w-2 h-2 bg-muted-foreground rounded-full transform translate-y-3" />
                  </div>
                )}
              </div>
            ))}
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

        @keyframes slideInStep {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes drawLine {
          from {
            width: 0;
          }
          to {
            width: 66.666667%;
          }
        }

        .section-header {
          animation: fadeInUp 0.8s ease-out;
        }

        .steps-grid {
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }

        .step-item {
          animation: slideInStep 0.6s ease-out both;
        }

        .steps-grid::before {
          content: '';
          position: absolute;
          top: 6rem;
          left: 16.666667%;
          height: 1px;
          background: hsl(var(--muted-foreground) / 0.2);
          animation: drawLine 1.5s ease-out 1s both;
        }

        @media (max-width: 1023px) {
          .steps-grid::before {
            display: none;
          }
        }
      `}</style>
    </section>
  );
});

HowItWorks.displayName = "HowItWorks";

export default HowItWorks;