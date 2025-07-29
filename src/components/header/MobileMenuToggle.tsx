// components/header/MobileMenuToggle.tsx
import React from 'react';
import { Menu, X } from "lucide-react";

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({ isOpen, onToggle }) => {
  return (
    <button
      className="md:hidden p-2 rounded-lg hover:bg-muted transition-all duration-200 
                 focus:outline-none focus:ring-2 focus:ring-ring"
      onClick={onToggle}
      aria-label="Toggle menu"
    >
      <div className="relative w-6 h-6">
        <Menu 
          className={`
            absolute inset-0 w-6 h-6 transition-all duration-300 
            ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}
          `} 
        />
        <X 
          className={`
            absolute inset-0 w-6 h-6 transition-all duration-300 
            ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}
          `} 
        />
      </div>
    </button>
  );
};

export default MobileMenuToggle;