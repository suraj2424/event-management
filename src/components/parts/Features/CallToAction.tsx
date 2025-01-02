import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/router';

const CallToAction = () => {
  const router = useRouter();
  return (
    <section 
      className="py-16 px-4 md:px-20 text-center"
    >
      <div className="max-w-2xl mx-auto">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-4 
          hover:text-cyan-400 
          transition-colors duration-300 ease-in-out"
        >
          Ready to Elevate Your Event Experience?
        </h2>
        <p 
          className="mb-8 text-base text-slate-500 
          hover:text-black 
          transition-colors duration-300"
        >
          Whether you're an organizer looking for efficient tools or an attendee eager to explore exciting activities, EVENZIA is here for you.
        </p>
        <button 
          className="mx-auto px-8 py-3 
          bg-cyan-400 text-black 
          font-bold rounded-full 
          hover:bg-cyan-300 
          transition-all duration-300 
          flex items-center justify-center 
          transform hover:scale-105 
          active:scale-95"
          onClick={() => router.push("/auth/organizer/signup")}
        >
          Join Us Today
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default CallToAction;