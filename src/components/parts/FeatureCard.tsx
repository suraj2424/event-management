import React, { forwardRef, ReactElement } from 'react';
import { Calendar, Users, Zap } from 'lucide-react';

interface FeatureCardProps {
  icon: ReactElement;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

const FeatureCard = ({ icon, title, description, bgColor, textColor, borderColor }: FeatureCardProps) => {
  return (
    <div 
      className={`${bgColor} ${textColor} border-${borderColor} p-6 rounded-md 
      transform transition-all duration-400 ease-in-out
      hover:shadow-2xl 
      flex flex-col justify-between 
      border border-opacity-50 border-white`}
    >
      <div>
        <div className="mb-4 flex justify-center">
          {React.cloneElement(icon, {
            className: "w-12 h-12 mb-4 opacity-80 group-hover:opacity-100 transition-opacity ease-in-out duration-300"
          })}
        </div>
        <h3 
          className="text-xl font-bold mb-3 text-center 
          transition-colors duration-300 
          group-hover:text-white ease-in-out"
        >
          {title}
        </h3>
        <p 
          className="text-base text-center opacity-70 
          group-hover:opacity-100 
          transition-opacity duration-300"
        >
          {description}
        </p>
      </div>
    </div>
  );
};

const FeaturesSection = forwardRef<HTMLElement>((_, ref) => {
  const features = [
    {
      icon: <Calendar className="text-yellow-700" />,
      title: "Seamless Event Registration",
      description: "Say goodbye to complex registration processes. Explore events tailored to your interests and register with just a few clicks.",
      bgColor: "bg-yellow-900 group",
      textColor: "text-yellow-300",
      borderColor: "border-yellow-300",
    },
    {
      icon: <Users className="text-sky-700" />,
      title: "Advanced Event Management",
      description: "Manage every aspect of your events with our robust platform. From ticketing to analytics, we've got you covered.",
      bgColor: "bg-sky-900 group",
      textColor: "text-sky-300",
      borderColor: "border-sky-300",
    },
    {
      icon: <Zap className="text-green-700" />,
      title: "Scalable Infrastructure",
      description: "Built with Next.js and PostgreSQL, our platform handles growth effortlessly. Host events of any size with speed and reliability.",
      bgColor: "bg-green-900 group",
      textColor: "text-green-300",
      borderColor: "border-green-300",
    },
  ];

  return (
    <section 
      className="min-h-screen py-16 px-4 md:px-12 
      flex flex-col justify-center"
      ref={ref}
    >
      <div className="max-w-6xl mx-auto">
        <h2 
          className="text-4xl md:text-5xl font-bold text-center mb-16 
          tracking-tight leading-tight"
        >
          Powerful Tools to Transform Your{" "}
          <span 
            className="text-cyan-700 
            transition-colors duration-500 
            hover:text-cyan-500"
          >
            Event Experience
          </span>
        </h2>

        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
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