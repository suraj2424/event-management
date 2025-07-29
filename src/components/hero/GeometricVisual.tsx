// components/hero/GeometricVisual.tsx
import React from 'react';
import { Card } from "@/components/ui/card";

const GeometricVisual: React.FC = () => {
  return (
    <div className="flex-1 relative max-w-lg ml-auto">
      <div className="relative aspect-square">
        {/* Main grid of cards */}
        <div className="grid grid-cols-3 gap-4 h-full geometric-grid">
          {Array.from({ length: 9 }, (_, i) => (
            <Card
              key={i}
              className={`
                transition-all duration-700 border-muted
                ${i === 4 ? 'bg-foreground' : 'bg-background'}
                ${i % 2 === 0 ? 'hover:scale-105' : 'hover:scale-95'}
              `}
              style={{ 
                animationDelay: `${i * 100}ms`,
                transform: `rotate(${i % 3 === 0 ? '2deg' : i % 2 === 0 ? '-2deg' : '0deg'})`
              }}
            >
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-muted/50 to-muted/20" />
            </Card>
          ))}
        </div>

        {/* Floating accent elements */}
      </div>

      <style jsx>{`
        .geometric-grid > * {
          animation: scaleIn 0.8s ease-out both;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-8px) translateX(4px); }
          66% { transform: translateY(4px) translateX(-2px); }
        }

        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-6px) translateX(-3px); }
        }

        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) scaleY(1); }
          50% { transform: translateY(-4px) scaleY(1.1); }
        }

        .animate-float-1 {
          animation: float-1 6s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 4s ease-in-out infinite;
        }

        .animate-float-3 {
          animation: float-3 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default GeometricVisual;