// components/LandingPage.tsx
import React, { useCallback, useState, useEffect, useMemo } from "react";
import Header from "@/components/parts/header";
import FeaturesSection from "@/components/parts/FeatureCard";
import EventSearch from "@/components/parts/Features/EventSearch";
import Footer from "@/components/parts/Footer";
import HowItWorks from "@/components/parts/Features/HowItWorks";
import Testimonials from "@/components/parts/Features/Testimonials";
import About from "@/components/parts/Features/About";
import CallToAction from "@/components/parts/Features/CallToAction";
import LoadingScreen from "@/components/LoadingScreen";
import HeroSection from "@/components/hero/HeroSection";
import NavigationDots from "@/components/hero/NavigationDots";

const LandingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'search', label: 'Search' },
    { id: 'howItWorks', label: 'How it Works' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'about', label: 'About' },
    { id: 'cta', label: 'Get Started' },
  ];

  // Create refs for all sections with consistent typing
  const sectionRefs = useMemo(() => ({
    hero: React.createRef<HTMLElement>(),
    features: React.createRef<HTMLElement>(),
    search: React.createRef<HTMLElement>(),
    howItWorks: React.createRef<HTMLElement>(),
    testimonials: React.createRef<HTMLElement>(),
    about: React.createRef<HTMLElement>(),
    cta: React.createRef<HTMLElement>(),
  }), []);

  type SectionKeys = keyof typeof sectionRefs;

  const scrollToSection = useCallback(
    (sectionName: SectionKeys) => {
      const targetRef = sectionRefs[sectionName];
      if (targetRef?.current) {
        targetRef.current.scrollIntoView({ 
          behavior: "smooth",
          block: "start"
        });
      }
    },
    [sectionRefs]
  );

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for active section tracking
  useEffect(() => {
    // Wait for loading to complete before setting up observer
    if (isLoading) return;

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Add a small delay to ensure refs are populated
    const timeoutId = setTimeout(() => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.observe(ref.current);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [sectionRefs, isLoading]);

  // Handle navigation dots click with type safety
  const handleNavigationClick = useCallback((sectionId: string) => {
    if (sectionId in sectionRefs) {
      scrollToSection(sectionId as SectionKeys);
    }
  }, [scrollToSection, sectionRefs]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen font-sans antialiased bg-background">
      <Header
        onFeaturesClick={() => scrollToSection("features")}
        onHowItWorksClick={() => scrollToSection("howItWorks")}
        onTestimonialsClick={() => scrollToSection("testimonials")}
        onAboutClick={() => scrollToSection("about")}
      />

      <NavigationDots
        activeSection={activeSection}
        sections={sections}
        onSectionClick={handleNavigationClick}
      />

      <main>
        <section ref={sectionRefs.hero} id="hero" className="section px-5">
          <HeroSection />
        </section>
        
        <section ref={sectionRefs.features} id="features" className="section">
          <FeaturesSection />
        </section>
        
        <section ref={sectionRefs.search} id="search" className="section">
          <EventSearch />
        </section>
        
        <section ref={sectionRefs.howItWorks} id="howItWorks" className="section">
          <HowItWorks />
        </section>
        
        <section ref={sectionRefs.testimonials} id="testimonials" className="section">
          <Testimonials />
        </section>
        
        <section ref={sectionRefs.about} id="about" className="section">
          <About />
        </section>
        
        <section ref={sectionRefs.cta} id="cta" className="section">
          <CallToAction />
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .section {
          scroll-margin-top: 80px; /* Adjust based on header height */
        }
      `}</style>
    </div>
  );
};

export default LandingPage;