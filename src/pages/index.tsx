import React, { useRef, useCallback } from "react";
import Header from "@/components/parts/header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ILLUSTRATION1 from "@/assets/images/illustration1.svg";
import FeaturesSection from "@/components/parts/FeatureCard";
import EventSearch from "@/components/parts/Features/EventSearch";
import Footer from "@/components/parts/Footer";
import HowItWorks from "@/components/parts/Features/HowItWorks";
import Testimonials from "@/components/parts/Features/Testimonials";
import About from "@/components/parts/Features/About";
import CallToAction from "@/components/parts/Features/CallToAction";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const LandingPage: React.FC = () => {
  const router = useRouter();
  const sectionRefs = {
    features: useRef<HTMLElement>(null),
    howItWorks: useRef<HTMLDivElement>(null),
    testimonials: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
  };

  const scrollToSection = useCallback(
    (sectionName: keyof typeof sectionRefs) => {
      sectionRefs[sectionName].current?.scrollIntoView({ behavior: "smooth" });
    },
    []
  );

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
  <div className="w-64 h-1 bg-gray-100 overflow-hidden">
    <div className="h-full bg-black animate-progress" />
  </div>
  <p className="text-gray-800 mt-4 font-light tracking-widest text-sm">
    LOADING
  </p>
  <style jsx>{`
    @keyframes progress {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .animate-progress {
      animation: progress 1.5s linear infinite;
      width: 100%;
    }
  `}</style>
</div>
    );
  }

  return (
    <motion.div
      className="min-h-screen  font-Nunito selection:bg-cyan-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header
        onFeaturesClick={() => scrollToSection("features")}
        onHowItWorksClick={() => scrollToSection("howItWorks")}
        onTestimonialsClick={() => scrollToSection("testimonials")}
        onAboutClick={() => scrollToSection("about")}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <section className="min-h-screen flex items-center justify-center px-4 md:px-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12">
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h1
                className="text-3xl md:text-5xl mb-4 text-slate-600 tracking-tight leading-tight 
            transition-all duration-500 ease-in-out hover:text-cyan-400"
              >
                Streamline your Events with
              </h1>

              <div
                className="text-cyan-400 text-5xl md:text-7xl font-bold mb-4 
            transform transition-transform duration-700 hover:scale-105"
              >
                EVENZIA
              </div>

              <p
                className="text-lg md:text-xl mb-8 text-slate-500 max-w-md mx-auto md:mx-0 
            opacity-80 hover:opacity-100 transition-opacity duration-300"
              >
                Where Planning Meets Innovation
              </p>

              <Button
                className="w-full md:w-auto px-8 py-3 
            bg-indigo-600 text-white 
            hover:bg-indigo-700 
            transition-all duration-300 
            rounded-full 
            shadow-lg hover:shadow-xl"
                onClick={() => router.push("/events")}
              >
                Get Started Now
              </Button>
            </div>

            <div className="w-full md:w-1/2 flex justify-center">
              <div className="w-full max-w-md transform transition-transform duration-700">
                <Image
                  src={ILLUSTRATION1}
                  alt="Event Illustration"
                  width={600}
                  height={600}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <FeaturesSection ref={sectionRefs.features} />

        <EventSearch />

        <HowItWorks ref={sectionRefs.howItWorks} />
        <Testimonials ref={sectionRefs.testimonials} />
        <About ref={sectionRefs.about} />
        <CallToAction />
      </main>

      <Footer />
    </motion.div>
  );
};

export default LandingPage;
