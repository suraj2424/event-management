import React, { forwardRef } from 'react';
import { Users, Target, Heart, Zap, Quote } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const About = forwardRef<HTMLDivElement>((props, ref) => {
  const values = [
    { icon: Users, title: "Community First", desc: "Building meaningful connections through exceptional event experiences." },
    { icon: Target, title: "Innovation Driven", desc: "Evolving our platform with cutting-edge event management tech." },
    { icon: Heart, title: "Passion Led", desc: "Dedicated to creating moments that matter with obsessive detail." },
    { icon: Zap, title: "Results Focused", desc: "Delivering success through data-driven insights and powerful tools." },
  ];

  return (
    <section ref={ref} className="py-32 px-4 bg-muted/10 relative">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Our Core <span className="text-primary italic">Philosophy</span></h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We aren't just a ticketing tool; we're the engine behind your most successful gatherings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {values.map((v, i) => (
            <div key={i} className="group p-8 rounded-[2.5rem] bg-background border border-primary/5 hover:border-primary/20 transition-all duration-500 hover:-translate-y-2">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <v.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{v.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Mission Glass Card */}
        <div className="relative overflow-hidden rounded-[3rem] p-1 bg-gradient-to-r from-primary/20 via-border to-primary/20">
          <Card className="border-0 bg-background/80 backdrop-blur-xl rounded-[2.9rem]">
            <CardContent className="p-12 md:p-20 text-center">
              <Quote className="w-12 h-12 text-primary/20 mx-auto mb-8" />
              <h3 className="text-2xl md:text-4xl font-medium tracking-tight leading-[1.4] max-w-4xl mx-auto">
                &ldquo;Our mission is to <span className="text-primary font-bold">democratize</span> event management by providing powerful tools that enable <span className="italic underline decoration-primary/30">anyone</span> to create extraordinary experiences.&rdquo;
              </h3>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
});

About.displayName = 'About';
export default About;