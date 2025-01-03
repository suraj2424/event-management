import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Heart, Zap } from 'lucide-react';

const About = forwardRef<HTMLDivElement>((props, ref) => {
  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "Building meaningful connections through exceptional event experiences",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: Target,
      title: "Innovation Driven",
      description: "Constantly evolving our platform with cutting-edge technology",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: Heart,
      title: "Passion Led",
      description: "Dedicated to creating memorable moments that matter",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      icon: Zap,
      title: "Results Focused",
      description: "Delivering measurable success for every event",
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <section 
      ref={ref}
      className="min-h-screen py-24 px-4 relative overflow-hidden flex items-center"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-slate-50/50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-indigo-50/50 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-semibold text-indigo-500 tracking-wide uppercase mb-3">
              About Us
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Transforming Events with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                Innovation
              </span>
            </h3>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
              At EVENZIA, we're passionate about creating meaningful connections through 
              exceptional event experiences. Our platform combines cutting-edge technology 
              with intuitive design to make event management seamless and engaging.
            </p>
          </motion.div>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-white rounded-2xl shadow-xl" />
                <div className="relative p-8 bg-white rounded-2xl transition-transform duration-300 group-hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-r ${value.gradient}`}>
                    {React.createElement(value.icon, {
                      className: "w-6 h-6 text-white"
                    })}
                  </div>
                  <h4 className="text-xl font-semibold text-slate-900 mb-3">
                    {value.title}
                  </h4>
                  <p className="text-slate-600">
                    {value.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
        >
          {[
            { label: 'Events Hosted', value: '10K+' },
            { label: 'Happy Users', value: '50K+' },
            { label: 'Team Members', value: '100+' },
            { label: 'Countries', value: '30+' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

About.displayName = 'About';

export default About;