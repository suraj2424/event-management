// components/header/NavigationItem.tsx
import React from 'react';

interface NavigationItemProps {
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ 
  label, 
  onClick, 
  isActive = false 
}) => {
  return (
    <button
      onClick={onClick}
      className="relative px-3 py-2 text-sm font-medium text-muted-foreground 
                hover:text-foreground transition-colors duration-200 group"
    >
      {label}
      <span 
        className={`
          absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-300
          ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}
        `} 
      />
    </button>
  );
};

export default NavigationItem;