import React, { forwardRef, ReactElement } from 'react';
import { Calendar, Users, Zap } from 'lucide-react';
import { cn } from "@/lib/utils"; // Make sure you have this utility

interface FeatureCardProps {
  icon: ReactElement;
  title: string;
  description: string;
  gradient: string;
}

const FeatureCard = ({ icon, title, description, gradient }: FeatureCardProps) => {
  return (
    <div className="group relative p-1 rounded-2xl transition-all duration-500 hover:scale-[1.02] ease-in-out">
      {/* Gradient border */}
      <div className={cn(
        "absolute inset-0 rounded-2xl opacity-25 blur-xl transition-opacity group-hover:opacity-50",
        gradient
      )} />
      
      {/* Card content */}
      <div className="relative flex flex-col h-full p-8 rounded-xl bg-white shadow-xl">
        {/* Icon wrapper */}
        <div className={cn(
          "w-12 h-12 rounded-xl mb-6 flex items-center justify-center",
          "bg-gradient-to-br shadow-lg",
          gradient
        )}>
          {React.cloneElement(icon, {
            className: "w-6 h-6 text-white"
          })}
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-slate-800 mb-4">
          {title}
        </h3>
        
        <p className="text-slate-600 leading-relaxed">
          {description}
        </p>

        {/* Hover effect */}
        <div className="mt-6 flex items-center text-sm font-medium">
          <span className={cn(
            "bg-clip-text text-transparent",
            gradient
          )}>
            Learn more
          </span>
          <svg
            className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
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
      </div>
    </div>
  );
};

const FeaturesSection = forwardRef<HTMLElement>((_, ref) => {
  const features = [
    {
      icon: <Calendar />,
      title: "Seamless Event Registration",
      description: "Streamline your registration process with our intuitive platform. Create, manage, and track registrations effortlessly.",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: <Users />,
      title: "Advanced Event Management",
      description: "Powerful tools to handle every aspect of your events, from ticketing to real-time analytics and reporting.",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: <Zap />,
      title: "Enterprise-Grade Infrastructure",
      description: "Built on cutting-edge technology to ensure reliability, security, and seamless scalability for events of any size.",
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
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white to-transparent" />
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white to-transparent" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-sm font-semibold text-indigo-500 tracking-wide uppercase mb-3">
            Features
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Transform Your{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Event Experience
            </span>
          </h3>
          <p className="max-w-2xl mx-auto text-lg text-slate-600">
            Powerful tools and features designed to make your event management seamless and successful
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              {...feature}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = "FeaturesSection";

export default FeaturesSection;