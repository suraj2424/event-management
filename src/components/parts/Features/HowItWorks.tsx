// components/parts/Features/HowItWorks.tsx
import React from 'react';
import { PencilLine, Megaphone, PartyPopper } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: PencilLine,
      title: "Create",
      desc: "Set up your event page in minutes with our intuitive builder.",
      color: "bg-blue-500/10 text-blue-400"
    },
    {
      icon: Megaphone,
      title: "Promote",
      desc: "Share your unique link and track ticket sales in real-time.",
      color: "bg-emerald-500/10 text-emerald-400"
    },
    {
      icon: PartyPopper,
      title: "Host",
      desc: "Check in guests with our app and enjoy your successful event.",
      color: "bg-orange-500/10 text-orange-400"
    }
  ];

  return (
    <section id="how-it-works" className="py-32 px-4 bg-background overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
            Simple as <span className="text-emerald-400 italic">1-2-3</span>
          </h2>
          <p className="text-muted-foreground text-lg font-medium opacity-80">
            Your journey from concept to crowd, simplified.
          </p>
        </div>

        <div className="relative">
          {/* 
            FIX 1: Adjusted 'top' to center the line behind the icons.
            Calculation: Number Badge + Margin + Half Icon height.
          */}
          <div className="hidden md:block absolute top-[104px] left-[15%] right-[15%] h-[1px] bg-foreground/10 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                
                {/* Step Number */}
                <div className="mb-6 flex items-center justify-center h-8">
                  <span className="text-[10px] font-black tracking-widest uppercase py-1 px-3 rounded-full border border-foreground/20 bg-background text-muted-foreground group-hover:border-emerald-400 group-hover:text-emerald-400 transition-colors">
                    0{i + 1}
                  </span>
                </div>

                {/* 
                  FIX 2: Added 'bg-background' and 'relative z-10' to mask the line.
                  This ensures the line appears to 'stop' at the edges of the icon box.
                */}
                <div className={`relative z-10 w-24 h-24 rounded-[2rem] bg-background border border-foreground/5 flex items-center justify-center mb-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-2xl`}>
                  {/* Inner Color Overlay */}
                  <div className={`absolute inset-0 rounded-[2rem] ${step.color} opacity-100`} />
                  <step.icon className="w-10 h-10 relative z-20" />
                </div>

                {/* Text Content */}
                <h3 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-emerald-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-[280px] text-sm md:text-base opacity-70">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;