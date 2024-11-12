import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import LogoImage from '@/assets/images/logo-transparent.png'
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Menu, X } from 'lucide-react';

interface HeaderProps {
  onFeaturesClick: () => void;
  onHowItWorksClick: () => void;
  onTestimonialsClick: () => void;
  onAboutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onFeaturesClick,
  onHowItWorksClick,
  onTestimonialsClick,
  onAboutClick
}) => {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const NavItems = () => (
    <>
      <li>
        <button onClick={onFeaturesClick} className='text-white text-sm p-2 hover:bg-white hover:text-black transition-all duration-300 ease-in-out rounded'>
          Features
        </button>
      </li>
      <li>
        <button onClick={onHowItWorksClick} className='text-white text-sm p-2 hover:bg-white hover:text-black transition-all duration-300 ease-in-out rounded'>
          How It Works
        </button>
      </li>
      <li>
        <button onClick={onTestimonialsClick} className='text-white text-sm p-2 hover:bg-white hover:text-black transition-all duration-300 ease-in-out rounded'>
          Testimonials
        </button>
      </li>
      <li>
        <button onClick={onAboutClick} className='text-white text-sm p-2 hover:bg-white hover:text-black transition-all duration-300 ease-in-out rounded'>
          About
        </button>
      </li>
    </>
  );

  return (
    <header className="text-black py-4">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src={LogoImage}
              alt="Evenzia Logo"
              width={140}
              height={140}
              draggable={false}
              className="select-none pointer-events-none mr-4 absolute -top-9 left-3"
            />
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <ul className="flex space-x-6">
              <NavItems />
            </ul>
          </div>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} className='text-white'/> : <Menu size={24} className='text-white'/>}
          </button>
          
          <div className="hidden md:block">
            <div className='flex items-center space-x-3'>
              <Button variant="destructive" asChild>
                <Link href="/events">Explore Events</Link>
              </Button>
            
              {status === "loading" ? (
                <Button variant="outline" disabled>
                  Loading...
                </Button>
              ) : session ? (
                <div className="flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className='text-black'>
                        <User className="mr-2 h-4 w-4" />
                        {session.user?.name || 'Account'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button variant="default" asChild>
                  <Link href="/signin">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4">
            <ul className="flex flex-col space-y-2">
              <NavItems />
              <li>
                <Button variant="destructive" asChild className="w-full">
                  <Link href="/events">Explore Events</Link>
                </Button>
              </li>
              {status !== "loading" && !session && (
                <li>
                  <Button variant="default" asChild className="w-full">
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </li>
              )}
              {session && (
                <>
                  <li>
                    <Link href="/dashboard" className="block p-2 text-white hover:bg-white hover:text-black transition-all duration-300 ease-in-out rounded">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile" className="block p-2 text-white hover:bg-white hover:text-black transition-all duration-300 ease-in-out rounded">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => signOut()} className="w-full text-left p-2 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 ease-in-out rounded">
                      Log out
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;