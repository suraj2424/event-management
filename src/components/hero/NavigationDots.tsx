// components/hero/NavigationDots.tsx
import React from 'react';

interface NavigationDotsProps {
  activeSection: string;
  sections: Array<{ id: string; label: string }>;
  onSectionClick: (sectionId: string) => void;
}

const NavigationDots: React.FC<NavigationDotsProps> = ({ 
  activeSection, 
  sections, 
  onSectionClick 
}) => {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-2">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionClick(section.id)}
          className="group relative p-2"
          aria-label={`Go to ${section.label}`}
        >
          <div
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${activeSection === section.id 
                ? 'bg-foreground scale-125' 
                : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
              }
            `}
          />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 
                         text-xs text-muted-foreground bg-background px-2 py-1 
                         rounded shadow-sm opacity-0 group-hover:opacity-100 
                         transition-opacity whitespace-nowrap">
            {section.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default NavigationDots;