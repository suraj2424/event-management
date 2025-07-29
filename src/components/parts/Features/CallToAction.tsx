// components/parts/Features/CallToAction.tsx
import React from 'react';
import { ArrowRight, Sparkles, Star, Calendar, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const CallToAction = () => {
  const router = useRouter();

  const features = [
    { 
      icon: Calendar, 
      title: "Easy Planning", 
      description: "Intuitive tools for seamless event management and organization" 
    },
    { 
      icon: Users, 
      title: "Growing Community", 
      description: "Connect with thousands of attendees and event professionals" 
    },
    { 
      icon: Star, 
      title: "Premium Features", 
      description: "Everything you need for successful and memorable events" 
    },
  ];

  return (
    <section className="py-24 px-4 relative bg-background">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-background" />
      
      <div className="container max-w-5xl mx-auto relative">
        <div className="text-center">
          {/* Header section */}
          <div className="mb-16 cta-header">
            <Badge variant="secondary" className="mb-6 cta-badge">
              <Sparkles className="w-4 h-4 mr-2" />
              Join the future of event management
            </Badge>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-foreground cta-title">
              Ready to Create{' '}
              <span className="text-muted-foreground">
                Unforgettable Events?
              </span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed cta-description">
              Join thousands of event organizers who are creating exceptional experiences 
              with EVENZIA&apos;s powerful platform and comprehensive tools.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 features-grid">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-500 hover:shadow-lg feature-card"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted/50 mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 cta-buttons">
            <Button
              size="lg"
              className="group h-12 px-8"
              onClick={() => router.push("/auth/organizer/signup")}
            >
              Get Started Now
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8"
              onClick={() => router.push("/events")}
            >
              Explore Events
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-12 pt-8 border-t border-muted social-proof">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-foreground text-foreground" />
                  ))}
                </div>
                <span className="font-medium">4.9/5</span>
                <span>from 1000+ reviews</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div>
                <span className="font-medium">50K+</span> events created
              </div>
              <div className="h-4 w-px bg-border" />
              <div>
                <span className="font-medium">100K+</span> happy users
              </div>
            </div>
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

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        .cta-header {
          animation: fadeInUp 0.8s ease-out;
        }

        .cta-badge {
          animation: fadeInScale 0.6s ease-out 0.2s both;
        }

        .cta-title {
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }

        .cta-description {
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .features-grid {
          animation: fadeInUp 0.8s ease-out 0.5s both;
        }

        .feature-card {
          animation: slideUp 0.6s ease-out both;
        }

        .cta-buttons {
          animation: fadeInUp 0.8s ease-out 0.8s both;
        }

        .social-proof {
          animation: fadeIn 1s ease-out 1s both;
        }
      `}</style>
    </section>
  );
};

export default CallToAction;