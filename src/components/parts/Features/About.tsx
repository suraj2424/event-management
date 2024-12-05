import React, { forwardRef } from 'react';

const About = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <section 
      id="about" 
      className="py-16 px-4 md:px-20"
      ref={ref}
    >
      <div className="max-w-4xl mx-auto">
        <h2 
          className="text-4xl md:text-5xl font-bold text-center mb-8 
          text-white tracking-tight leading-tight 
          hover:text-cyan-400 transition-colors duration-300"
        >
          Who We Are
        </h2>
        <p 
          className="text-center text-base md:text-lg text-slate-400 
          leading-relaxed 
          hover:text-white 
          transition-colors duration-300"
        >
          At EVENZIA, we believe in making event planning and participation as effortless as possible. Our dedicated team of developers and event professionals has worked tirelessly to craft a platform that meets the needs of both organizers and attendees. With cutting-edge technology at our fingertips, our mission is to create memorable, engaging events that bring people together.
        </p>
      </div>
    </section>
  );
});

About.displayName = 'About';

export default About;