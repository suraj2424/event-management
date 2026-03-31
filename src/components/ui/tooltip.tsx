"use client";

import React, { useState } from "react";

// 1. TooltipProvider - In pure Tailwind, this is just a context or a fragment
// We'll keep the export name for compatibility with your existing code
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// 2. Tooltip - Manages the visibility state
export function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div 
      className="relative flex items-center" 
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Logic to pass the 'open' state to children */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { open });
        }
        return child;
      })}
    </div>
  );
}

// 3. TooltipTrigger - Just renders the element
export const TooltipTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  return <div className="cursor-default">{children}</div>;
};

// 4. TooltipContent - The styled bubble using Absolute positioning
export function TooltipContent({ 
  children, 
  className = "", 
  side = "top", 
  open 
}: { 
  children: React.ReactNode; 
  className?: string; 
  side?: "top" | "bottom" | "left" | "right";
  open?: boolean; // Injected by Tooltip parent
}) {
  if (!open) return null;

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className={`
        absolute z-50 whitespace-nowrap rounded bg-slate-900 px-2.5 py-1 text-xs text-white shadow-lg
        animate-in fade-in zoom-in-95 duration-150
        ${positions[side]}
        ${className}
      `}
    >
      {children}
      {/* Tooltip Arrow */}
      <div className={`
        absolute h-0 w-0 border-4 border-transparent
        ${side === 'top' ? 'top-full left-1/2 -translate-x-1/2 border-t-slate-900' : ''}
        ${side === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900' : ''}
        ${side === 'left' ? 'left-full top-1/2 -translate-y-1/2 border-l-slate-900' : ''}
        ${side === 'right' ? 'right-full top-1/2 -translate-y-1/2 border-r-slate-900' : ''}
      `} />
    </div>
  );
}