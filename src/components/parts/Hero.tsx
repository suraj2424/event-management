import React from 'react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const Hero = ({ onExploreClick }: { onExploreClick: () => void }) => {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />

      <div className="container relative z-10 text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-primary/10 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold tracking-widest uppercase">The Future of Events is Here</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
          Events Made <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-foreground to-primary/50">Extraordinary.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          The all-in-one platform to plan, promote, and manage events that people actually talk about. Built for creators, loved by attendees.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
           <Link href="/signup">
             <Button size="lg" className="h-14 px-8 rounded-full text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
               Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
             </Button>
           </Link>
           <Button variant="ghost" size="lg" className="h-14 px-8 rounded-full text-lg font-semibold group" onClick={onExploreClick}>
             <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
               <Play className="w-4 h-4 fill-current" />
             </div>
             Watch Demo
           </Button>
         </div>
      </div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;