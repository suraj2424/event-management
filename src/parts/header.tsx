import React from 'react';
import Image from 'next/image';
import LogoImage from "@/app/assets/images/a-sleek-and-modern-logo-for-evenzia-a-professional-1IrUvzGaSMGVmzopk656Tg-x9G1NsKCTpOHl4PWrrixIg2.jpeg";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="container mx-auto px-4 py-6 relative h-16 HEADER">
      <nav className="flex justify-between items-center">
        <div className="">
          <Image
            src={LogoImage}
            alt="Evenzia Logo"
            width={150}
            height={150}
            draggable={false}
            className="mix-blend-lighten select-none pointer-events-none"
          />
        </div>
        <div className="space-x-4 md:flex text-white">
          <Button variant="ghost" asChild>
            <a href="#features">Features</a>
          </Button>
          <Button variant="ghost" asChild>
            <a href="#how-it-works">How It Works</a>
          </Button>
          <Button variant="ghost" asChild>
            <a href="#testimonials">Testimonials</a>
          </Button>
          <Button variant="ghost" asChild>
            <a href="#about">About Us</a>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;