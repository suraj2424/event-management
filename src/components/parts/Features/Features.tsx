import React from 'react';
import { Ticket, Zap, Shield, Globe, BarChart3, Users2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const Features = () => {
  const featureList = [
    { 
      icon: Ticket, 
      title: "Smart Ticketing", 
      desc: "Dynamic pricing and instant QR-code generation for seamless entry.",
      size: "large" 
    },
    { 
      icon: BarChart3, 
      title: "Real-time Insights", 
      desc: "Track sales, attendance, and engagement live from your dashboard.",
      size: "small" 
    },
    { 
      icon: Globe, 
      title: "Global Reach", 
      desc: "Multi-currency support for events without borders.",
      size: "small" 
    },
    { 
      icon: Zap, 
      title: "Instant Promotion", 
      desc: "Auto-sync your events with social media platforms in one click.",
      size: "large" 
    },
  ];

  return (
    <section id="features" className="py-32 px-4 relative">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-4 rounded-full px-4 border-primary/10">Capabilities</Badge>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
              Everything You Need <br /> To <span className="text-primary italic">Scale</span> Your Vision.
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-xs border-l-2 border-primary/20 pl-6 mb-2">
            Powerful tools designed for professional organizers and first-time creators alike.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureList.map((f, i) => (
            <div 
              key={i} 
              className={`group relative overflow-hidden rounded-[2.5rem] p-8 border border-primary/5 bg-secondary/20 hover:bg-background hover:shadow-2xl hover:shadow-primary/5 transition-all duration-700 ${
                f.size === "large" ? "md:col-span-2" : "md:col-span-1"
              }`}
            >
              {/* Decorative Glow */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-background border border-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:rotate-6">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm">{f.desc}</p>
              </div>

              {/* Bottom Decoration for Large Cards */}
              {f.size === "large" && (
                <div className="mt-12 h-20 w-full bg-gradient-to-r from-primary/10 to-transparent rounded-xl flex items-center px-6 gap-4 border border-primary/5">
                  <div className="flex -space-x-2">
                     {[1,2,3].map(j => <div key={j} className="w-6 h-6 rounded-full bg-primary/20" />)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Powering 500+ top events</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;