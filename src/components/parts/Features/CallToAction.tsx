import React from 'react';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-32 px-4 relative">
      <div className="container max-w-5xl mx-auto relative z-10">
        <div className="relative overflow-hidden rounded-[4rem] p-8 md:p-20 bg-foreground text-background shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/10 border border-background/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-background">Join the revolution</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-none">
              Ready to <span className="text-primary italic">Transform</span> <br /> Your Next Event?
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="lg" className="h-16 px-10 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-primary/30">
                Create Event Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="h-16 px-10 rounded-full border-background/20 text-background hover:bg-background hover:text-foreground font-bold transition-all">
                View Pricing
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4 pt-8 border-t border-background/10">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-foreground bg-secondary" />
                ))}
              </div>
              <p className="text-sm font-medium text-background/60">Trusted by 2,000+ organizers worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;