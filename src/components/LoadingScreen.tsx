// components/LoadingScreen.tsx
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-muted rounded-full animate-spin-slow">
            <div className="absolute top-0 left-0 w-3 h-3 bg-foreground rounded-full"></div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground font-medium tracking-wider">
          Loading
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;