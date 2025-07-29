// components/parts/FeatureCard.tsx
import React, { forwardRef } from 'react';
import { Calendar, Users, Zap } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <Card 
      className="group h-full border-0 bg-background/60 backdrop-blur-sm hover:bg-background/80 
                transition-all duration-500 hover:shadow-lg hover:-translate-y-1 feature-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6 h-full flex flex-col">
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted/50 
                       group-hover:bg-muted transition-colors duration-300 mb-4">
          <Icon className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-foreground/90 transition-colors">
          {title}
        </h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
          {description}
        </p>

        {/* Learn more link */}
        <div className="mt-4 flex items-center text-xs font-medium text-muted-foreground 
                       group-hover:text-foreground transition-colors duration-300">
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

      <style jsx>{`
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

        .feature-card {
          animation: slideUp 0.6s ease-out both;
        }
      `}</style>
    </Card>
  );
};

const FeaturesSection = forwardRef<HTMLElement>((_, ref) => {
  const features = [
    {
      icon: Calendar,
      title: "Seamless Registration",
      description: "Streamline your registration process with our intuitive platform. Create, manage, and track registrations effortlessly with real-time updates.",
    },
    {
      icon: Users,
      title: "Smart Management",
      description: "Powerful tools to handle every aspect of your events, from ticketing to real-time analytics and comprehensive reporting dashboards.",
    },
    {
      icon: Zap,
      title: "Enterprise Ready",
      description: "Built on cutting-edge technology to ensure reliability, security, and seamless scalability for events of any size or complexity.",
    },
  ];

  return (
    <section 
      ref={ref}
      className="py-24 px-4 relative bg-muted/20"
    >
      <div className="container max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 section-header">
          <Badge variant="secondary" className="mb-4">
            Features
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Transform Your{' '}
            <span className="text-muted-foreground">
              Event Experience
            </span>
          </h2>
          
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Powerful tools and features designed to make your event management 
            seamless and successful
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 features-grid">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 150}
            />
          ))}
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

        @keyframes slideInGrid {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .section-header {
          animation: fadeInUp 0.8s ease-out;
        }

        .features-grid {
          animation: slideInGrid 0.8s ease-out 0.3s both;
        }
      `}</style>
    </section>
  );
});

FeaturesSection.displayName = "FeaturesSection";

export default FeaturesSection;