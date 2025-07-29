// components/header/Navigation.tsx
import React from 'react';
import NavigationItem from './NavigationItem';

interface NavigationProps {
  onFeaturesClick: () => void;
  onHowItWorksClick: () => void;
  onTestimonialsClick: () => void;
  onAboutClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  onFeaturesClick,
  onHowItWorksClick,
  onTestimonialsClick,
  onAboutClick,
}) => {
  const navItems = [
    { label: "Features", onClick: onFeaturesClick },
    { label: "How It Works", onClick: onHowItWorksClick },
    { label: "Testimonials", onClick: onTestimonialsClick },
    { label: "About", onClick: onAboutClick },
  ];

  return (
    <nav className="hidden md:flex items-center">
      <ul className="flex items-center gap-1">
        {navItems.map((item) => (
          <li key={item.label}>
            <NavigationItem
              label={item.label}
              onClick={item.onClick}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;