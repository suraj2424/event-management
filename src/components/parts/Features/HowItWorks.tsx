import React, { forwardRef } from 'react';
import { Search, Calendar, Settings } from 'lucide-react';

const HowItWorks = forwardRef<HTMLDivElement>((props, ref) => {
  const steps = [
    {
      icon: Search,
      title: "Explore Events",
      description: "Browse through a wide range of events categorized by interest, date, and location.",
      gradient: "from-pink-500 to-rose-500",
      delay: "0",
    },
    {
      icon: Calendar,
      title: "Register Effortlessly",
      description: "Complete your registration in minutes. Fill in your details, choose your ticket, and you're in!",
      gradient: "from-indigo-500 to-blue-500",
      delay: "150",
    },
    {
      icon: Settings,
      title: "Manage Your Experience",
      description: "Access your personalized dashboard to manage orders and receive real-time updates.",
      gradient: "from-violet-500 to-purple-500",
      delay: "300",
    },
  ];

  return (
    <section 
      ref={ref}
      className="py-24 px-4 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-slate-50/50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-indigo-50/50 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-sm font-semibold text-indigo-500 tracking-wide uppercase mb-3">
            How It Works
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Get Started in{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Three Simple Steps
            </span>
          </h3>
          <p className="max-w-2xl mx-auto text-lg text-slate-600">
            We've simplified the event management process so you can focus on what matters most
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={step.delay}
              className="group relative"
            >
              {/* Card */}
              <div className="relative p-8 bg-white rounded-2xl shadow-xl">
                {/* Gradient border effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl mb-8 flex items-center justify-center bg-gradient-to-r ${step.gradient}`}>
                    {React.createElement(step.icon, {
                      className: "w-6 h-6 text-white"
                    })}
                  </div>

                  {/* Step number */}
                  <div className="absolute top-8 right-8 text-6xl font-bold opacity-5 group-hover:opacity-10 transition-opacity">
                    {index + 1}
                  </div>

                  {/* Title */}
                  <h4 className="text-xl font-semibold text-slate-900 mb-4">
                    {step.title}
                  </h4>

                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Learn more link */}
                  <div className="mt-6 flex items-center text-sm font-medium">
                    <span className={`bg-clip-text text-transparent bg-gradient-to-r ${step.gradient}`}>
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

              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 left-full w-8 h-0.5 bg-slate-200">
                  <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

HowItWorks.displayName = "HowItWorks";

export default HowItWorks;