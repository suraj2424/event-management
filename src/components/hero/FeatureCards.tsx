// components/hero/FeatureCards.tsx
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Target, Shield, Zap, HeadphonesIcon } from "lucide-react";

const FeatureCards: React.FC = () => {
  const features = [
    { 
      icon: Target, 
      label: "Smart Planning", 
      description: "AI-powered insights"
    },
    { 
      icon: Shield, 
      label: "Secure", 
      description: "End-to-end encryption"
    },
    { 
      icon: Zap, 
      label: "Fast", 
      description: "Lightning performance"
    },
    { 
      icon: HeadphonesIcon, 
      label: "Support", 
      description: "24/7 assistance"
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 feature-cards">
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <Card 
            key={feature.label} 
            className="group cursor-pointer transition-all duration-300 hover:shadow-md border-muted"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-2 rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium text-sm">{feature.label}</div>
                  <div className="text-xs text-muted-foreground">{feature.description}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      <style jsx>{`
        .feature-cards > * {
          animation: fadeInUp 0.6s ease-out both;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
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

export default FeatureCards;