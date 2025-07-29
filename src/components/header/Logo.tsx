// components/header/Logo.tsx
import React from 'react';
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

const Logo: React.FC = () => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/")}
      className="flex items-center gap-2 cursor-pointer group"
    >
      <div className="relative">
        <Sparkles className="w-6 h-6 text-foreground transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute inset-0 w-6 h-6 text-foreground/20 animate-ping-slow" />
      </div>
      <span className="text-xl font-bold text-foreground tracking-tight">
        EVENZIA
      </span>
      
      <style jsx>{`
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.4;
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Logo;