import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      Icon: Facebook, 
      href: '#', 
      label: 'Facebook',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      Icon: Twitter, 
      href: '#', 
      label: 'Twitter',
      gradient: 'from-sky-400 to-sky-500'
    },
    { 
      Icon: Linkedin, 
      href: '#', 
      label: 'LinkedIn',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    { 
      Icon: Instagram, 
      href: '#', 
      label: 'Instagram',
      gradient: 'from-pink-500 via-purple-500 to-indigo-500'
    }
  ];

  const quickLinks = [
    { label: 'About Us', href: '#' },
    { label: 'Features', href: '#' },
    { label: 'Pricing', href: '#' },
    { label: 'Blog', href: '#' },
  ];

  const legalLinks = [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ];

  return (
    <footer className="relative bg-white border-t border-slate-100">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50" />

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                EVENZIA
              </span>
            </div>
            <p className="text-slate-600 max-w-xs">
              Transforming the event landscape, one experience at a time. Creating memorable moments through innovative solutions.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ Icon, href, label, gradient }) => (
                <a
                  key={label}
                  href={href}
                  className="group relative p-2 rounded-full hover:bg-slate-100 transition-colors"
                  aria-label={label}
                >
                  <Icon className={`w-5 h-5 bg-clip-text text-transparent bg-gradient-to-r ${gradient}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600">surajsuryawanshi2424@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600">+91 9075450141</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600">Umarkhed, Maharashtra</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-500 text-sm">
              © {currentYear} EVENZIA. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-slate-500 hover:text-slate-600 text-sm">
                Terms
              </a>
              <span className="text-slate-300">·</span>
              <a href="#" className="text-slate-500 hover:text-slate-600 text-sm">
                Privacy
              </a>
              <span className="text-slate-300">·</span>
              <a href="#" className="text-slate-500 hover:text-slate-600 text-sm">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;