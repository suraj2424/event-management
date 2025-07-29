// components/parts/Footer.tsx
import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { Icon: Facebook, href: '#', label: 'Facebook' },
    { Icon: Twitter, href: '#', label: 'Twitter' },
    { Icon: Linkedin, href: '#', label: 'LinkedIn' },
    { Icon: Instagram, href: '#', label: 'Instagram' }
  ];

  const quickLinks = [
    { label: 'About Us', href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  const supportLinks = [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Support', href: '#' },
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
  ];

  const legalLinks = [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'GDPR', href: '#' },
  ];

  const contactInfo = [
    { Icon: Mail, text: 'surajsuryawanshi2424@gmail.com', href: 'mailto:surajsuryawanshi2424@gmail.com' },
    { Icon: Phone, text: '+91 9075450141', href: 'tel:+919075450141' },
    { Icon: MapPin, text: 'Umarkhed, Maharashtra', href: '#' },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container max-w-7xl mx-auto px-4 pb-4 pt-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 footer-content">
          {/* Brand section */}
          <div className="lg:col-span-2 space-y-6 brand-section">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-foreground" />
                <div className="absolute inset-0 w-6 h-6 text-foreground/20 animate-ping-slow" />
              </div>
              <span className="text-2xl font-bold text-foreground tracking-tight">
                EVENZIA
              </span>
            </div>
            
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Transforming the event landscape, one experience at a time. Creating memorable 
              moments through innovative solutions and powerful tools.
            </p>
            
            {/* Social links */}
            <div className="flex gap-2">
              {socialLinks.map(({ Icon, href, label }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-muted transition-colors"
                  asChild
                >
                  <a href={href} aria-label={label}>
                    <Icon className="w-4 h-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 links-section">
            <h3 className="font-semibold text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4 links-section">
            <h3 className="font-semibold text-foreground">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Contact */}
          <div className="space-y-6 contact-section">
            {/* Legal Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                Legal
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                Contact
              </h3>
              <ul className="space-y-3">
                {contactInfo.map(({ Icon, text, href }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors" />
                      <span className="text-sm">{text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bottom-bar">
          <p className="text-muted-foreground text-sm">
            © {currentYear} EVENZIA. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <span className="text-muted-foreground/40">·</span>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <span className="text-muted-foreground/40">·</span>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.4;
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }

        .footer-content {
          animation: fadeInUp 0.8s ease-out;
        }

        .brand-section {
          animation: fadeInUp 0.8s ease-out 0.1s both;
        }

        .links-section {
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .contact-section {
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }

        .bottom-bar {
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .animate-ping-slow {
          animation: ping-slow 3s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;