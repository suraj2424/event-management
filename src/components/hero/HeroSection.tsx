// components/hero/HeroSection.tsx
import React from 'react';
import HeroContent from './HeroContent';
import FeatureCards from './FeatureCards';
import GeometricVisual from './GeometricVisual';

const HeroSection: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <HeroContent />
            <FeatureCards />
          </div>
          <GeometricVisual />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;