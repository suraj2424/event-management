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
      <section className="min-h-screen relative overflow-hidden bg-white">
  {/* Gradient Orbs */}
  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-100 via-purple-50 to-transparent rounded-full blur-3xl opacity-60" />
  <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-50 via-blue-50 to-transparent rounded-full blur-3xl opacity-60" />

  <div className="relative z-10 container mx-auto px-4 py-20">
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
      {/* Content Section */}
      <div className="flex-1 space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-50 rounded-full">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            <span className="ml-2 text-sm text-indigo-600 font-medium">
              Launching Something Special
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="text-slate-800">Make your</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              events matter
            </span>
          </h1>
          
          <p className="text-slate-600 text-lg md:text-xl max-w-xl">
            Create, manage, and celebrate moments that leave lasting impressions.
            Your all-in-one platform for exceptional event experiences.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            className="group relative px-8 py-6 bg-gradient-to-r from-indigo-500 to-purple-500 
                       rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg 
                       hover:shadow-indigo-200"
            onClick={() => router.push("/events")}
          >
            <span className="relative z-10 text-white font-medium">Get Started</span>
            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 
                          group-hover:opacity-100 transition-opacity" />
          </Button>

          <Button
            variant="outline"
            className="px-8 py-6 border-2 border-slate-200 text-slate-600 
                     hover:bg-slate-50 rounded-xl"
          >
            Watch Demo
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
          {[
            { icon: "🎯", label: "Smart Planning", value: "Simplified" },
            { icon: "🔒", label: "Security", value: "Enterprise-grade" },
            { icon: "⚡", label: "Performance", value: "Lightning-fast" },
            { icon: "🤝", label: "Support", value: "24/7 Help" },
          ].map((feature) => (
            <div key={feature.label} className="p-4 rounded-xl bg-slate-50 
                                              hover:bg-slate-100 transition-colors">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <div className="text-sm text-slate-600">{feature.label}</div>
              <div className="text-sm font-semibold text-slate-800">
                {feature.value}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 3D Abstract Element */}
      <div className="flex-1 relative">
        <div className="relative aspect-square max-w-[500px] mx-auto">
          {/* Abstract 3D Shapes */}
          <div className="absolute inset-0 grid grid-cols-2 gap-4 animate-float">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`
                  rounded-2xl bg-gradient-to-br
                  ${i % 2 === 0 
                    ? 'from-indigo-400 to-purple-400' 
                    : 'from-pink-400 to-rose-400'}
                  p-8 transform transition-transform duration-500
                  hover:scale-105 shadow-lg
                  ${i % 3 === 0 ? 'translate-y-4' : ''}
                  ${i % 2 === 0 ? 'translate-x-2' : '-translate-x-2'}
                `}
              >
                <div className="w-full h-full rounded-xl bg-white/20" />
              </div>
            ))}
          </div>
        </div>
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
