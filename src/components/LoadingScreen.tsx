// components/LoadingScreen.tsx
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[hsl(var(--background))] z-[100] flex flex-col items-center justify-center backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-8">
        <div className="relative flex items-center justify-center">
          {/* Outer Breathing Ring */}
          <div className="absolute w-20 h-20 border-2 border-[hsl(var(--primary)/0.1)] rounded-[2.5rem] animate-organic-pulse" />
          
          {/* Inner Morphing Shape */}
          <div className="w-10 h-10 bg-[hsl(var(--primary))] shadow-[0_0_30px_hsl(var(--primary)/0.2)] animate-organic-morph" />
        </div>
        
        <div className="flex flex-col items-center space-y-1">
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-[hsl(var(--foreground))] opacity-80">
            Gathering
          </span>
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary)/0.4)] animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary)/0.4)] animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary)/0.4)] animate-bounce" />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes organic-morph {
          0%, 100% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; transform: scale(1); }
          50% { border-radius: 70% 30% 46% 54% / 30% 29% 71% 70%; transform: scale(1.1) rotate(5deg); }
        }
        @keyframes organic-pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; border-radius: 2.5rem; }
          50% { transform: scale(1.4); opacity: 0.1; border-radius: 3.5rem; }
        }
        .animate-organic-morph {
          animation: organic-morph 3s ease-in-out infinite;
        }
        .animate-organic-pulse {
          animation: organic-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;