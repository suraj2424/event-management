import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Compass, LogIn, LayoutGrid, User, LogOut, Settings,
  LayoutDashboard, CalendarRange, UserCircle, ChevronDown,
  Menu, X, Sparkles
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const router = useRouter();

  const NavItems = () => (
    <>
      {['Features', 'How It Works', 'Testimonials', 'About'].map((item) => (
        <li key={item}>
          <button
            onClick={() => {
              switch(item) {
                case 'Features': onFeaturesClick(); break;
                case 'How It Works': onHowItWorksClick(); break;
                case 'Testimonials': onTestimonialsClick(); break;
                case 'About': onAboutClick(); break;
              }
            }}
            className="relative px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors group"
          >
            {item}
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>
        </li>
      ))}
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <Sparkles className="w-6 h-6 text-indigo-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              EVENZIA
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-2">
              <NavItems />
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-slate-600 hover:text-slate-900"
              asChild
            >
              <Link href="/events">
                <Compass className="w-4 h-4 mr-2" />
                Explore Events
              </Link>
            </Button>

            {session?.user?.role === 'ORGANIZER' && (
              <Button
                variant="outline"
                className="border-indigo-200 hover:border-indigo-300"
                asChild
              >
                <Link href="/create-event">Create Event</Link>
              </Button>
            )}

            {status === "loading" ? (
              <Button variant="outline" disabled>Loading...</Button>
            ) : session ? (
              <UserDropdownMenu session={session} />
            ) : (
              <Button
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                asChild
              >
                <Link href="/signin">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden"
            >
              <MobileMenu
                session={session}
                NavItems={NavItems}
                onClose={() => setMobileMenuOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

// Separate components for cleaner organization
const UserDropdownMenu = ({ session }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="flex items-center space-x-2">
        <UserCircle className="w-4 h-4" />
        <span>{session.user?.name || 'Account'}</span>
        <ChevronDown className="w-4 h-4 opacity-50" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4" />
                        <span>My Account</span>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {session.user?.role === "ORGANIZER" ? (
                        <DropdownMenuItem asChild>
                          <Link
                            href="/manage-events"
                            className="flex items-center gap-2"
                          >
                            <CalendarRange className="h-4 w-4" />
                            <span>Manage Events</span>
                          </Link>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem asChild>
                          <Link
                            href="/profile"
                            className="flex items-center gap-2"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem asChild>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2"
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href="/profile/settings"
                          className="flex items-center gap-2"
                        >
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
);

const MobileMenu = ({ session, NavItems, onClose }) => (
  <motion.div
    className="px-2 py-4 space-y-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
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
                    <Link
                      href="/events"
                      className="flex items-center justify-center gap-2"
                    >
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
                      <Link
                        href="/signin"
                        className="flex items-center justify-center gap-2"
                      >
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
);

export default Header;