import React from 'react';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import MAIN_LOGO from "@/assets/images/logo-transparent.png";

const Footer = () => {
  const socialLinks = [
    { 
      Icon: Facebook, 
      href: '#', 
      label: 'Facebook',
      color: 'hover:text-blue-500'
    },
    { 
      Icon: Twitter, 
      href: '#', 
      label: 'Twitter',
      color: 'hover:text-cyan-400'
    },
    { 
      Icon: Linkedin, 
      href: '#', 
      label: 'LinkedIn',
      color: 'hover:text-indigo-500'
    },
    { 
      Icon: Instagram, 
      href: '#', 
      label: 'Instagram',
      color: 'hover:text-pink-500'
    }
  ];

  return (
    <footer 
      className="bg-slate-950 backdrop-blur-lg py-16 
      border-t border-zinc-800"
    >
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Tagline */}
          <div className="flex flex-col items-center md:items-start">
            {/* <Image
              src={MAIN_LOGO}
              alt="Evenzia Logo"
              width={200}
              height={200}
              className="object-contain mb-4"
            /> */}
            <h3 
              className="text-2xl font-bold text-white 
              hover:text-cyan-400 transition-colors duration-300"
            >
              EVENZIA
            </h3>
            <p 
              className="text-center md:text-left text-slate-400 
              hover:text-white transition-colors duration-300"
            >
              Transforming the event landscape, one experience at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 
              className="text-lg font-bold mb-4 
              text-white hover:text-cyan-400 
              transition-colors duration-300"
            >
              Quick Links
            </h4>
            <ul className="space-y-2 text-center md:text-left">
              {['Contact Us', 'Terms of Service', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-slate-400 
                    hover:text-cyan-400 
                    hover:underline 
                    transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social and Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h4 
              className="text-lg font-bold mb-4 
              text-white hover:text-cyan-400 
              transition-colors duration-300"
            >
              Connect With Us
            </h4>
            
            <div className="flex space-x-4 mb-4">
              {socialLinks.map(({ Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  className={`text-slate-400 ${color} 
                  transition-all duration-300 
                  hover:scale-110`}
                  aria-label={label}
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
            
            <div className="text-center md:text-left text-slate-400">
              <p 
                className="hover:text-white 
                transition-colors duration-300 mb-1"
              >
                surajsuryawanshi2424@gmail.com
              </p>
              <p 
                className="hover:text-cyan-400 
                transition-colors duration-300"
              >
                <span className="text-cyan-500">+91</span> 9075450141
              </p>
            </div>
          </div>
        </div>

        <div 
          className="mt-12 pt-6 border-t border-zinc-800 
          text-center text-sm text-slate-500 
          hover:text-white transition-colors duration-300"
        >
          © 2024 EVENZIA. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;