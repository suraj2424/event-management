// components/parts/Navbar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from '@/providers/contexts/theme-context';
import { CustomSession } from '@/components/event-form/types/event';
import { 
  Sparkles, 
  Menu, 
  X, 
  ArrowRight, 
  Sun, 
  Moon, 
  User, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  PlusCircle,
  Monitor
} from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, setTheme, actualTheme } = useTheme();
  const { data: session } = useSession() as { data: CustomSession | null };
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'About', href: '#about' },
    { name: 'Events', href: '/events' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled ? 'py-3' : 'py-6'
    }`}>
      <div className="container max-w-7xl mx-auto px-4">
        <div className={`relative flex items-center justify-between px-4 md:px-6 py-2 rounded-full border transition-all duration-500 ${
          isScrolled 
            ? 'bg-background/70 backdrop-blur-xl border-foreground/10 shadow-lg' 
            : 'bg-transparent border-transparent'
        }`}>
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center text-background shadow-lg group-hover:rotate-6 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter italic uppercase hidden sm:block">
              Evenzia
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Center */}
          <div className="flex items-center gap-2 md:gap-3">
            
            {!session && (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/signin"
                    className="px-5 py-2 bg-foreground text-background rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all"
                  >
                    Sign In
                  </Link>
                </div>
                <div className="h-6 w-px bg-foreground/10 hidden sm:block" />
              </>
            )}

            {/* Custom Theme Toggle */}
            <button
              className="relative w-9 h-9 flex items-center justify-center rounded-full border border-foreground/5 hover:bg-foreground/5 transition-colors"
              onClick={() => setTheme(actualTheme === 'dark' ? 'light' : 'dark')}
              title={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {actualTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-yellow-500 animate-in zoom-in duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 animate-in zoom-in duration-300" />
              )}
            </button>

            {session && (
              <>
                <div className="h-6 w-px bg-foreground/10 hidden sm:block" />

                {/* Manual User Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-9 h-9 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center hover:ring-2 hover:ring-foreground/10 transition-all"
                  >
                    <User className="w-5 h-5 text-muted-foreground" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-4 w-56 p-2 rounded-[1.5rem] bg-background border border-foreground/10 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                        Account
                      </div>
                      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-foreground hover:text-background transition-colors text-sm font-bold">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link href="/dashboard/settings" onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-foreground/5 transition-colors text-sm font-bold">
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      <div className="h-px bg-foreground/5 my-1" />
                      <button
                        type="button"
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          try {
                            await signOut();
                            router.push("/");
                          } catch (error) {
                            console.error("SignOut error:", error);
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-destructive/10 text-destructive transition-colors text-sm font-bold"
                      >
                        <LogOut className="w-4 h-4" /> Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {session && session.user.role === 'ORGANIZER' && (
              <Link
                href="/dashboard/events/create"
                className="hidden sm:flex items-center bg-foreground text-background rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                Create <PlusCircle className="ml-2 w-4 h-4" />
              </Link>
            )}

            {/* Mobile Toggle */}
            <button 
              className="md:hidden p-2" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-background z-[110] transition-transform duration-500 md:hidden ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-foreground" />
              <span className="text-2xl font-black italic">EVENZIA</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-4xl font-black tracking-tighter hover:italic transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {!session && (
            <div className="mt-auto flex flex-col gap-4">
              <Link
                href="/signup"
                className="w-full bg-foreground text-background flex items-center justify-center rounded-full h-16 text-lg font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started <ArrowRight className="ml-2" />
              </Link>

              <Link
                href="/signin"
                className="w-full border border-foreground/20 text-foreground flex items-center justify-center rounded-full h-16 text-lg font-bold hover:bg-foreground/5 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Mobile Theme Toggle */}
          <div className="flex justify-center gap-4 py-4">
              {['light', 'dark', 'system'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t as 'light' | 'dark' | 'system')}
                  className={`p-3 rounded-xl border ${theme === t ? 'bg-foreground text-background' : 'border-foreground/10 text-muted-foreground'}`}
                >
                  {t === 'light' && <Sun className="w-5 h-5" />}
                  {t === 'dark' && <Moon className="w-5 h-5" />}
                  {t === 'system' && <Monitor className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </div>
        </div>
    </nav>
  );
};

export default Navbar;
