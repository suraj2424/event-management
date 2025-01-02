import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import {motion} from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Compass, 
  LogIn, 
  LayoutGrid, 
  User, 
  LogOut,
  Settings,
  LayoutDashboard, 
  CalendarRange, 
  UserCircle,
  ChevronDown
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X } from 'lucide-react';

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
        <button onClick={onFeaturesClick} className=' text-sm p-2 hover:bg-black hover:text-white transition-all duration-300 ease-in-out rounded'>
          Features
        </button>
      </li>
      <li>
        <button onClick={onHowItWorksClick} className=' text-sm p-2 hover:bg-black hover:text-white transition-all duration-300 ease-in-out rounded'>
          How It Works
        </button>
      </li>
      <li>
        <button onClick={onTestimonialsClick} className=' text-sm p-2 hover:bg-black hover:text-white transition-all duration-300 ease-in-out rounded'>
          Testimonials
        </button>
      </li>
      <li>
        <button onClick={onAboutClick} className=' text-sm p-2 hover:bg-black hover:text-white transition-all duration-300 ease-in-out rounded'>
          About
        </button>
      </li>
    </>
  );

  const router = useRouter();

  return (
    <header className="text-black py-5 tracking-wide">
      <div className="container mx-auto px-10">
        <nav className="flex justify-between items-center">
          <div className="flex items-center">
            <p className='text-xl hover:cursor-pointer' onClick={()=>{
              router.push('/')
            }}>EVENZIA</p>
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
    <Button variant="outline" className="text-black flex items-center gap-2">
      <User className="h-4 w-4" />
      <span>{session.user?.name || 'Account'}</span>
      <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56" align="end">
    <DropdownMenuLabel className="flex items-center gap-2">
      <UserCircle className="h-4 w-4" />
      <span>My Account</span>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    
    {session.user?.role === 'ORGANIZER' ? (
      <DropdownMenuItem asChild>
        <Link href="/manage-events" className="flex items-center gap-2">
          <CalendarRange className="h-4 w-4" />
          <span>Manage Events</span>
        </Link>
      </DropdownMenuItem>
    ) : (
      <DropdownMenuItem asChild>
        <Link href="/profile" className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
      </DropdownMenuItem>
    )}
    
    <DropdownMenuItem asChild>
      <Link href="/profile" className="flex items-center gap-2">
        <User className="h-4 w-4" />
        <span>Profile</span>
      </Link>
    </DropdownMenuItem>
    
    <DropdownMenuItem asChild>
      <Link href="/profile/settings" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </Link>
    </DropdownMenuItem>
    
    <DropdownMenuSeparator />
    
    <DropdownMenuItem 
      onClick={() => signOut()} 
      className="text-red-600 focus:text-red-50 focus:bg-red-600"
    >
      <LogOut className="h-4 w-4 mr-2" />
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
          <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden mt-4 px-4"
        >
          <div className="md:hidden mt-4 px-4">
  <ul className="flex flex-col space-y-3">
    <NavItems />
    <li>
      <Button 
        variant="default" 
        asChild 
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
      >
        <Link href="/events" className="flex items-center justify-center gap-2">
          <Compass className="w-5 h-5" />
          <span>Explore Events</span>
        </Link>
      </Button>
    </li>
    
    {status !== "loading" && !session && (
      <li>
        <Button 
          variant="outline" 
          asChild 
          className="w-full border-2 border-gray-700 hover:bg-gray-800 text-gray-200 hover:text-white transition-all duration-300"
        >
          <Link href="/signin" className="flex items-center justify-center gap-2">
            <LogIn className="w-5 h-5" />
            <span>Sign In</span>
          </Link>
        </Button>
      </li>
    )}
    
    {session && (
      <>
        <li>
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 p-3 text-gray-200 hover:bg-gray-800 rounded-lg transition-all duration-300 ease-in-out"
          >
            <LayoutGrid className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
        </li>
        
        <li>
          <Link 
            href="/profile" 
            className="flex items-center gap-2 p-3 text-gray-200 hover:bg-gray-800 rounded-lg transition-all duration-300 ease-in-out"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
        </li>

        <li>
          <Link 
            href="/settings" 
            className="flex items-center gap-2 p-3 text-gray-200 hover:bg-gray-800 rounded-lg transition-all duration-300 ease-in-out"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </li>
        
        <li>
          <button 
            onClick={() => signOut()} 
            className="w-full flex items-center gap-2 p-3 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-300 ease-in-out"
          >
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </li>
      </>
    )}
  </ul>
</div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;