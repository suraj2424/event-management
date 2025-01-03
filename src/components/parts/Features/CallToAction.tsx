import React from 'react';
import { ArrowRight, Sparkles, Star, Calendar, Users } from 'lucide-react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const CallToAction = () => {
  const router = useRouter();

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 right-4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Floating elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Join the future of event management
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Ready to Create{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Unforgettable Events?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto"
          >
            Join thousands of event organizers who are creating exceptional experiences with EVENZIA's powerful platform.
          </motion.p>

          {/* Features grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {[
              { icon: Calendar, title: "Easy Planning", desc: "Intuitive tools for seamless event management" },
              { icon: Users, title: "Growing Community", desc: "Connect with thousands of attendees" },
              { icon: Star, title: "Premium Features", desc: "Everything you need for successful events" },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-100"
              >
                <feature.icon className="w-8 h-8 text-indigo-500 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => router.push("/auth/organizer/signup")}
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium 
                         hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]
                         flex items-center justify-center gap-2"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => router.push("/events")}
              className="px-8 py-4 rounded-xl border-2 border-slate-200 text-slate-600 font-medium
                         hover:border-slate-300 hover:bg-slate-50 transition-all duration-300"
            >
              Explore Events
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CallToAction;