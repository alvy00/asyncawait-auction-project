/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "../../components/ui/button";
import { Input } from '../../components/ui/input';
import { Search, Menu, X, Bell, Heart, ChevronDown, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { useUser } from '../../lib/user-context';
import toast from 'react-hot-toast';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaShieldAlt, FaSignInAlt, FaTachometerAlt } from 'react-icons/fa';
import { HiOutlineLogin } from 'react-icons/hi'
import { FiArrowRight, FiLogIn, FiSettings, FiUserCheck } from 'react-icons/fi';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { loggedIn, logout } = useAuth();  
  const { user } = useUser();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Navigation items for reuse
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Auctions', href: '#', dropdown: true, items: [
      { name: 'All Auctions', href: '/auctions/all' },
      { name: 'Upcoming Auctions', href: '/auctions/upcoming' },
      { name: 'Past Auctions', href: '/auctions/past' },
    ]},
    { name: 'How it works', href: '/how-it-works' },
    { name: 'Contact', href: '/contact' },
  ];

  useEffect(() => {
    console.log(user);
  }, [])

  const handleLogOut = () => {
    logout();
    toast.success('Logged out successfully')
    router.push('/');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a1929]/95' : 'bg-transparent'} backdrop-blur-sm`}>      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-white.png"
              alt="AuctaSync Logo"
              width={200}
              height={80}
            />
          </Link>

          {/* Main Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <div key={index} className={`relative ${item.dropdown ? 'group' : ''}`}>
                {item.dropdown ? (
                  <div ref={dropdownRef}>
                    <button 
                      onClick={() => handleDropdown(item.name)}
                      className="text-white hover:text-orange-400 transition-colors flex items-center text-sm font-medium"
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 w-48 bg-[#0a1929] rounded-lg py-2 mt-1 z-50 shadow-lg"
                        >
                          {item.items?.map((subItem, subIndex) => (
                            <Link 
                              key={subIndex} 
                              href={subItem.href} 
                              className="block px-4 py-2 text-white hover:bg-[#162a3d] text-sm"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link 
                    href={item.href} 
                    className="text-white hover:text-orange-400 transition-colors text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          
          {/* Search and Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <div className="relative">
                <Input 
                  type="search"
                  placeholder="Find your items..."
                  className="w-56 pl-10 h-9 rounded-full bg-[#0a1929] border-[#1e3a52] text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring focus:ring-orange-500/20"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            
            {loggedIn && (
              <>
                  {/* Notification Icon */}
                  <Link
                    href=".."
                    className="text-white hidden md:block hover:text-gray-400 hover:bg-gray-800 hover:scale-110 transition-all p-2 rounded-full"
                  >
                    <Bell className="w-5 h-5" />
                  </Link>

                  {/* Messages Icon */}
                  <Link
                    href=".."
                    className="text-white hidden md:block hover:text-gray-400 hover:bg-gray-800 hover:scale-110 transition-all p-2 rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </Link>

                  {/* Favorites Icon */}
                  <Link
                    href="/favourites"
                    className="text-white hidden md:block hover:text-gray-400 hover:bg-gray-800 hover:scale-110 transition-all p-2 rounded-full"
                  >
                    <Heart className="w-5 h-5" />
                  </Link>
              </>
            )}

            
            {/* Login/Signup/Dashboard/Logout Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {loggedIn ? (
                <>{user.is_admin? (
                    <Button
                      variant="ghost"
                      className="text-orange-400 hover:text-white hover:bg-orange-600/10 h-9 px-4 text-sm font-semibold tracking-wide transition-colors duration-200 rounded-lg backdrop-blur-md border border-orange-400/20 shadow-orange-500/10 shadow-sm"
                      asChild
                    >
                      <Link href="/admin" className="flex items-center gap-2">
                        <FaShieldAlt className="text-orange-300" />
                        Admin Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-4 h-9 text-sm font-semibold rounded-md
                                bg-black/70 border border-cyan-500 text-cyan-400
                                shadow-[0_0_8px_rgb(6_182_212_/_0.5)]
                                hover:bg-cyan-600/20 hover:text-cyan-300 hover:shadow-[0_0_14px_rgb(6_182_212_/_0.8)]
                                transition duration-300 cursor-pointer select-none"
                      asChild
                    >
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <FiSettings className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </Button>
                  )}

                    <Button
                      onClick={handleLogOut}
                      className="
                        bg-transparent
                        border border-red-600
                        text-red-600
                        hover:bg-red-600 hover:text-white
                        font-semibold
                        px-5 h-9 text-sm rounded-md
                        shadow-md
                        transition-colors duration-300
                        cursor-pointer
                      "
                    >
                      Logout
                    </Button>
                </>
              ) : (
                <>

                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-orange-400 border border-orange-400 hover:bg-gray-800 hover:text-orange-300 h-9 px-5 text-sm font-semibold rounded-md transition-colors duration-300"
                    asChild
                  >
                    <Link href="/login" className="flex items-center">
                      <FiUserCheck className="w-5 h-5" />
                      Sign In
                    </Link>
                  </Button>

                  <Button
                    className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold h-9 px-5 text-sm rounded-md flex items-center gap-2 shadow-md shadow-orange-500/40 transition-colors duration-300"
                    asChild
                  >
                    <Link href="/signup" className="flex items-center">
                      Get Started <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>

                </>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white p-1"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0a1929] border-t border-[#1e3a52]/50"
          >
            <div className="container mx-auto px-4 py-4">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <Input 
                  type="search"
                  placeholder="Find your items..."
                  className="w-full pl-10 h-10 rounded-full bg-[#0a1929] border-[#1e3a52] text-white placeholder:text-gray-400"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              
              {/* Mobile Navigation */}
              <nav className="space-y-4 mb-6">
                {navItems.map((item, index) => (
                  <div key={index} className="py-2">
                    {item.dropdown ? (
                      <div>
                        <button 
                          onClick={() => handleDropdown(item.name + '-mobile')}
                          className="text-white flex justify-between w-full items-center text-base font-medium"
                        >
                          {item.name}
                          <ChevronDown className="w-5 h-5" />
                        </button>
                        
                        <AnimatePresence>
                          {activeDropdown === item.name + '-mobile' && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-2 pl-4 border-l border-[#1e3a52] space-y-2"
                            >
                              {item.items?.map((subItem, subIndex) => (
                                <Link 
                                  key={subIndex} 
                                  href={subItem.href} 
                                  className="block py-2 text-gray-300 hover:text-white text-sm"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link 
                        href={item.href} 
                        className="text-white block text-base font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
              
              {/* Mobile Action Icons */}
              <div className="flex justify-between mb-6">
                <Link href="/notifications" className="text-white flex flex-col items-center" onClick={() => setMobileMenuOpen(false)}>
                  <Bell className="w-6 h-6 mb-1" />
                  <span className="text-xs">Notifications</span>
                </Link>
                
                <Link href="/messages" className="text-white flex flex-col items-center" onClick={() => setMobileMenuOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs">Messages</span>
                </Link>
                
                <Link href="/favorites" className="text-white flex flex-col items-center" onClick={() => setMobileMenuOpen(false)}>
                  <Heart className="w-6 h-6 mb-1" />
                  <span className="text-xs">Favorites</span>
                </Link>
              </div>
              
              {/* Mobile Login/Signup */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-red text-red hover:bg-white/20 hover:text-white w-full transition-colors duration-200"
                  asChild
                >
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                </Button>
                
                <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full" asChild>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign up</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};