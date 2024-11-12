import React, { useRef, useCallback, useState } from "react";
import { ArrowRight, Calendar, Users, Zap, Star, Search } from "lucide-react";
import Header from "@/components/parts/header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ILLUSTRATION1 from "@/assets/images/illustration1.svg";
import MAIN_LOGO from "@/assets/images/logo-transparent.png";

const LandingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sectionRefs = {
    features: useRef<HTMLElement>(null),
    howItWorks: useRef<HTMLElement>(null),
    testimonials: useRef<HTMLElement>(null),
    about: useRef<HTMLElement>(null),
  };

  const scrollToSection = useCallback(
    (sectionName: keyof typeof sectionRefs) => {
      sectionRefs[sectionName].current?.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionName);
    },
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black font-Nunito selection:bg-emerald-600">
      <Header
        onFeaturesClick={() => scrollToSection("features")}
        onHowItWorksClick={() => scrollToSection("howItWorks")}
        onTestimonialsClick={() => scrollToSection("testimonials")}
        onAboutClick={() => scrollToSection("about")}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-8 md:py-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-8 md:mb-0 text-center md:text-left pl-10">
              <h1 className="text-2xl md:text-5xl mb-4 text-slate-300 cursor typewriter-animation">
                <span data-text="Streamline">Streamline</span>
                <span data-text="Your">Your</span>
                <span data-text="Events">Events</span>
                <span data-text="with">with</span>
              </h1>

              <span className="text-cyan-400 text-3xl md:text-6xl font-semibold">
                EVENZIA
              </span>
              <p className="text-base md:text-xl mb-6 text-slate-400">
                Where Planning Meets Innovation
              </p>
              <Button
                size="lg"
                className="text-indigo-50 bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto"
              >
                Get Started Now
              </Button>
            </div>
            <div className="w-full md:w-1/2">
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
        </section>

        <section ref={sectionRefs.features} className="py-8 md:py-20">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-white">
            Powerful Tools to Transform Your{" "}
            <span className="text-cyan-400">Event Experience</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: (
                  <Calendar className="w-10 h-10 md:w-12 md:h-12 mb-4 text-yellow-400" />
                ),
                title: "Seamless Event Registration",
                description:
                  "Say goodbye to complex registration processes. Explore events tailored to your interests and register with just a few clicks.",
                bgColor: "bg-yellow-900",
                textColor: "text-yellow-100",
              },
              {
                icon: (
                  <Users className="w-10 h-10 md:w-12 md:h-12 mb-4 text-sky-400" />
                ),
                title: "Advanced Event Management",
                description:
                  "Manage every aspect of your events with our robust platform. From ticketing to analytics, we've got you covered.",
                bgColor: "bg-sky-900",
                textColor: "text-sky-100",
              },
              {
                icon: (
                  <Zap className="w-10 h-10 md:w-12 md:h-12 mb-4 text-green-400" />
                ),
                title: "Scalable Infrastructure",
                description:
                  "Built with Next.js and Redis, our platform handles growth effortlessly. Host events of any size with speed and reliability.",
                bgColor: "bg-green-900",
                textColor: "text-green-100",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`${feature.bgColor} ${feature.textColor} p-4 md:p-6 rounded-xl transition-all duration-300 ease-in-out`}
              >
                {feature.icon}
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="event-search" className="py-8 md:py-16 px-4 md:px-20">
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            <div className="bg-white p-4 md:p-6 rounded-lg backdrop-blur-lg">
              <h3 className="text-xl md:text-2xl font-semibold">
                Find Your Next Event
              </h3>
              <p className="text-slate-500 text-sm md:text-base">
                Search for events by keyword, category, or location
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Search events..."
                className="w-full py-2 px-4 rounded-md bg-zinc-800 text-white focus:outline-none selection:text-black selection:bg-white"
              />
              <select className="w-full p-2 rounded-md bg-zinc-800 text-white">
                <option value="">Category</option>
                <option value="conferences">Conferences</option>
                <option value="workshops">Workshops</option>
                <option value="networking">Networking</option>
              </select>
              <select className="w-full p-2 rounded-md bg-zinc-800 text-white">
                <option value="">Location</option>
                <option value="newyork">New York</option>
                <option value="losangeles">Los Angeles</option>
                <option value="chicago">Chicago</option>
              </select>
              <button className="w-full bg-white text-indigo-600 font-semibold py-2 px-6 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center justify-center">
                <Search className="mr-2 w-4 h-4" />
                Search
              </button>
            </div>
          </div>
        </section>

        <section
          ref={sectionRefs.howItWorks}
          id="how-it-works"
          className="py-8 md:py-16 px-4 md:px-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-8 md:mb-12 text-white">
            Three Simple Steps to Manage Your Event
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Explore Events",
                description:
                  "Browse through a wide range of events categorized by interest, date, and location.",
              },
              {
                title: "Register Effortlessly",
                description:
                  "Complete your registration in minutes. Fill in your details, choose your ticket, and you're in!",
              },
              {
                title: "Manage Your Experience",
                description:
                  "Access your personalized dashboard to manage orders and receive real-time updates.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="flex-1 p-4 md:p-6 rounded-lg backdrop-blur-lg bg-zinc-950 text-white hover:bg-zinc-900 transition-all duration-300 ease-in-out"
              >
                <div className="text-4xl md:text-5xl font-extrabold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-slate-400">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          ref={sectionRefs.testimonials}
          id="testimonials"
          className="py-8 md:py-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-8 md:mb-12 text-white">
            What Our Users Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "Emily Johnson",
                role: "Event Planner",
                quote:
                  "Evenzia has revolutionized how I handle events. The registration process is incredibly smooth, and the analytics tools provide invaluable insights.",
              },
              {
                name: "Michael Torres",
                role: "Conference Organizer",
                quote:
                  "The advanced features offered by Evenzia allowed us to scale our annual conference effortlessly. Attendee feedback was overwhelmingly positive.",
              },
              {
                name: "Sarah Lee",
                role: "Attendee",
                quote:
                  "I was amazed at how easy it was to find and register for events that matched my interests. The user-friendly interface made everything straightforward!",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-zinc-900 p-4 md:p-6 rounded-lg backdrop-blur-lg border border-zinc-800 text-white hover:bg-gradient-to-br hover:from-stone-900 hover:to-slate-900 transition-all duration-300 ease-in-out"
              >
                <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 mb-4" />
                <p className="mb-4 text-xs md:text-sm">{testimonial.quote}</p>
                <div className="font-bold">{testimonial.name}</div>
                <div className="text-xs md:text-sm text-zinc-400">
                  {testimonial.role}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section ref={sectionRefs.about} id="about" className="py-8 md:py-16">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 md:mb-8 text-white">
            Who We Are
          </h2>
          <p className="text-center max-w-2xl mx-auto text-zinc-500 text-sm md:text-base">
            At EVENZIA, we believe in making event planning and participation as
            effortless as possible. Our dedicated team of developers and event
            professionals has worked tirelessly to craft a platform that meets
            the needs of both organizers and attendees. With cutting-edge
            technology at our fingertips, our mission is to create memorable,
            engaging events that bring people together.
          </p>
        </section>

        <section className="py-8 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Elevate Your Event Experience?
          </h2>
          <p className="mb-6 md:mb-8 text-sm md:text-base">
            Whether you're an organizer looking for efficient tools or an
            attendee eager to explore exciting activities, EVENTMANAGER is here
            for you.
          </p>
          <button className="bg-white text-indigo-600 font-semibold py-2 px-6 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center justify-center mx-auto w-full md:w-auto">
            Join Us Today
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </section>
      </main>

      <footer className="bg-white py-8">
        <div className="container mx-auto px-4 text-black">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <Image
                src={MAIN_LOGO}
                alt="Event Illustration"
                width={200}
                height={200}
                className="bg-transparent object-contain mx-auto md:mx-0"
              />
              <p className="text-center md:text-left mt-4">
                Transforming the event landscape, one experience at a time.
              </p>
            </div>
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <h4 className="text-lg font-semibold mb-4 text-cyan-500 text-center md:text-left">
                Quick Links
              </h4>
              <ul className="space-y-2 text-center md:text-left">
                <li>
                  <a href="#" className="hover:underline">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h4 className="text-lg font-semibold mb-4 text-cyan-400 text-center md:text-left">
                Connect With Us
              </h4>
              <div className="flex justify-center md:justify-start space-x-4 mb-4">
                <a href="#" className="hover:text-indigo-300">
                  <span className="sr-only">Facebook</span>F
                </a>
                <a href="#" className="hover:text-indigo-300">
                  <span className="sr-only">Twitter</span>T
                </a>
                <a href="#" className="hover:text-indigo-300">
                  <span className="sr-only">LinkedIn</span>L
                </a>
                <a href="#" className="hover:text-indigo-300">
                  <span className="sr-only">Instagram</span>I
                </a>
              </div>
              <p className="mt-4">surajsuryawanshi2424@gmail.com</p>
              <p>
                <span className="text-blue-400">+91</span> 9075450141
              </p>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-zinc-500">
            © 2024 EVENZIA. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
