import React from 'react';
import { Sparkles, Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-background pt-24 pb-12 px-4 border-t border-primary/5">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-2xl font-black tracking-tighter italic">EVENZIA</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Redefining how the world gathers. From small meetups to global summits.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4 text-muted-foreground text-sm font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Ticketing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-4 text-muted-foreground text-sm font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Contact</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li className="flex items-center gap-3"><Mail className="w-4 h-4" /> support@evenzia.com</li>
              <li className="flex items-center gap-3"><MapPin className="w-4 h-4" /> Maharashtra, India</li>
            </ul>
          </div>
        </div>

        <Separator className="bg-primary/5 mb-8" />
        
        <div className="flex flex-col md:row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
          <p>© {year} Evenzia Technologies</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;