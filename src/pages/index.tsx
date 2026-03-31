'use client';

import React, { useRef } from 'react';
import Hero from '@/components/parts/Hero';
import Features from '@/components/parts/Features/Features';
import About from '@/components/parts/Features/About';
import HowItWorks from '@/components/parts/Features/HowItWorks';
import CallToAction from '@/components/parts/Features/CallToAction';
import Footer from '@/components/parts/Footer';
import Navbar from '@/components/parts/Navbar'; // Assuming you have a standard Navbar

export default function LandingPage() {
  // Refs for smooth scrolling navigation
  const featuresRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  return (
    <main className="relative min-h-screen overflow-x-hidden selection:bg-primary/30">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      <Navbar />

      <div className="flex flex-col w-full">
        <Hero onExploreClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })} />
        
        <div ref={featuresRef} className="scroll-mt-20">
          <Features />
        </div>

        <div ref={howItWorksRef} className="scroll-mt-20">
          <HowItWorks />
        </div>

        <div ref={aboutRef} className="scroll-mt-20">
          <About />
        </div>

        <CallToAction />
        
        <Footer />
      </div>
    </main>
  );
}