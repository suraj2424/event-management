import React, { forwardRef } from 'react';

const HowItWorks = forwardRef<HTMLDivElement>((props, ref) => {
  const steps = [
    {
      title: "Explore Events",
      description: "Browse through a wide range of events categorized by interest, date, and location.",
    },
    {
      title: "Register Effortlessly",
      description: "Complete your registration in minutes. Fill in your details, choose your ticket, and you're in!",
    },
    {
      title: "Manage Your Experience",
      description: "Access your personalized dashboard to manage orders and receive real-time updates.",
    },
  ];

  return (
    <section 
      id="how-it-works" 
      className="py-16 px-4 md:px-20"
      ref={ref}
    >
      <div className="max-w-6xl mx-auto">
        <h2 
          className="text-4xl md:text-5xl font-bold text-center mb-12 tracking-wide leading-tight 
          hover:text-cyan-400 transition-colors duration-300"
        >
          Three Simple Steps to Manage Your Event
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl 
              bg-zinc-50 backdrop-blur-lg 
              border border-zinc-200 
              hover:border-cyan-400 
              transition-all duration-500 ease-in-out
              transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <div 
                className="text-5xl font-bold mb-4 
                text-transparent bg-clip-text 
                bg-gradient-to-r from-cyan-400 to-indigo-600 
                group-hover:from-indigo-600 group-hover:to-cyan-400 
                transition-all duration-500 ease-in-out"
              >
                {index + 1}
              </div>
              <h3 
                className="text-xl font-semibold mb-3 
                text-black group-hover:text-cyan-400 
                transition-colors duration-300 ease-in-out"
              >
                {step.title}
              </h3>
              <p 
                className="text-slate-600 
                group-hover:text-black 
                transition-colors duration-300 ease-in-out"
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

HowItWorks.displayName = "HowItWorks";


export default HowItWorks;