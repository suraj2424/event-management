// components/hero/HeroContent.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const HeroContent: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex-1 max-w-2xl space-y-8 hero-content">
      <div className="space-y-6">
        <Badge variant="secondary" className="w-fit">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          Now in Beta
        </Badge>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="text-foreground">Events made</span>
            <br />
            <span className="text-muted-foreground">effortless</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            A modern platform for creating and managing events that matter. 
            Simple, powerful, and built for today&apos;s needs.
          </p>
        </div>
      </div>

      <div className="flex">
        <Button
          size="lg"
          className="group h-12 px-8"
          onClick={() => router.push("/events")}
        >
          Get Started
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <style jsx>{`
        .hero-content {
          animation: slideUp 0.8s ease-out;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default HeroContent;