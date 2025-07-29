// components/header/Header.tsx
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Logo from '@/components/header/Logo';
import Navigation from '@/components/header/Navigation';
import ActionButtons from '@/components/header/ActionButtons';
import MobileMenuToggle from '@/components/header/MobileMenuToggle';
import MobileMenu from '@/components/header/MobileMenu';

interface HeaderProps {
  onFeaturesClick: () => void;
  onHowItWorksClick: () => void;
  onTestimonialsClick: () => void;
  onAboutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onFeaturesClick,
  onHowItWorksClick,
  onTestimonialsClick,
  onAboutClick,
}) => {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled 
          ? 'bg-background/80 backdrop-blur-md border-b shadow-sm' 
          : 'bg-background/60 backdrop-blur-sm border-b border-transparent'
        }
      `}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          <Logo />
          
          <Navigation
            onFeaturesClick={onFeaturesClick}
            onHowItWorksClick={onHowItWorksClick}
            onTestimonialsClick={onTestimonialsClick}
            onAboutClick={onAboutClick}
          />

          <ActionButtons session={session} status={status} />

          <MobileMenuToggle
            isOpen={mobileMenuOpen}
            onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </div>

        {mobileMenuOpen && (
          <MobileMenu
            session={session}
            status={status}
            onFeaturesClick={onFeaturesClick}
            onHowItWorksClick={onHowItWorksClick}
            onTestimonialsClick={onTestimonialsClick}
            onAboutClick={onAboutClick}
            onClose={() => setMobileMenuOpen(false)}
          />
        )}
      </div>
    </header>
  );
};

export default Header;