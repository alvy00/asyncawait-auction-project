/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "../../components/ui/button";
import { Input } from '../../components/ui/input';
import { Search, Menu, X, Bell, Heart, ChevronDown, Home, LogOut, User, Settings, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import toast from 'react-hot-toast';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { loggedIn, logout } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const avatarDropdownRef = useRef<HTMLDivElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);

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
      
      if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(event.target as Node) && avatarDropdownOpen) {
        setAvatarDropdownOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen, avatarDropdownOpen]);

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

  const handleLogOut = () => {
    logout();
    toast.success('Logged out successfully')
    router.push('/');
  };

  // Animation variants
  const navbarVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: -25 },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      } 
    },
    exit: { 
      opacity: 0, 
      y: 10, 
      scale: 0.95,
      transition: { 
        duration: 0.2 
      } 
    }
  };

  const staggerMenuItems = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      } 
    },
  };

  return (
    <motion.header 
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-[#0a1929]/80' : 'bg-transparent'} backdrop-blur-md border-b border-[#1e3a52]/20`}
    >      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Image
                src="/logo.svg"
                alt="AuctaSync Logo"
                width={200}
                height={80}
                className="transition-all duration-300 group-hover:brightness-125"
                priority
              />
            </motion.div>
          </Link>

          {/* Main Navigation - For Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div 
                key={index} 
                className={`relative ${item.dropdown ? 'group' : ''}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
              >
                {item.dropdown ? (
                  <div ref={dropdownRef}>
                    <motion.button 
                      onClick={() => handleDropdown(item.name)}
                      className="text-white hover:text-orange-400 transition-colors flex items-center text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.name}
                      <motion.div
                        animate={{ rotate: activeDropdown === item.name ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </motion.div>
                    </motion.button>
                    
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div 
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute top-full left-0 w-48 bg-gradient-to-b from-[#0a1929]/95 to-[#0a1929]/90 rounded-lg py-2 mt-1 z-50 shadow-lg backdrop-blur-md border border-[#1e3a52]/30"
                        >
                          {item.items?.map((subItem, subIndex) => (
                            <motion.div
                              key={subIndex}
                              variants={menuItemVariants}
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              <Link 
                                href={subItem.href} 
                                className="block px-4 py-2 text-white hover:bg-[#162a3d]/70 hover:text-orange-400 text-sm transition-all duration-200"
                              >
                                {subItem.name}
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      href={item.href} 
                      className="text-white hover:text-orange-400 transition-colors text-sm font-medium relative group"
                    >
                      {item.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </nav>
          
          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <motion.div 
              className="relative hidden md:block"
              animate={{ width: searchFocused ? '220px' : '180px' }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <Input 
                  type="search"
                  placeholder="Find your items..."
                  className={`pl-10 h-9 rounded-full bg-[#0a1929]/60 border-[#1e3a52]/50 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring focus:ring-orange-500/20 transition-all duration-300 ${searchFocused ? 'shadow-lg shadow-orange-500/10' : ''}`}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </motion.div>
            
            {/* Action Icons */}
            <div className="hidden md:flex items-center space-x-1">
              {/* Notification Icon */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  href=".."
                  className="text-white flex items-center justify-center w-9 h-9 hover:text-orange-400 hover:bg-[#162a3d]/70 transition-all p-2 rounded-full relative group"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span className="absolute inset-0 rounded-full bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </motion.div>

              {/* Messages Icon */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  href=".."
                  className="text-white flex items-center justify-center w-9 h-9 hover:text-orange-400 hover:bg-[#162a3d]/70 transition-all p-2 rounded-full relative group"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="absolute inset-0 rounded-full bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </motion.div>

              {/* Favorites Icon */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  href="/favourites"
                  className="text-white flex items-center justify-center w-9 h-9 hover:text-orange-400 hover:bg-[#162a3d]/70 transition-all p-2 rounded-full relative group"
                >
                  <Heart className="w-5 h-5" />
                  <span className="absolute inset-0 rounded-full bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </motion.div>
            </div>
            
            {/* Login/Signup/Avatar with Dropdown */}
            <div className="hidden md:flex items-center space-x-3">
              {loggedIn ? (
                <div className="relative" ref={avatarDropdownRef}>
                  <motion.button 
                    onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 relative overflow-hidden"
                    aria-label="User menu"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-sm font-medium relative z-10">AS</span>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-orange-500 to-purple-600 opacity-0 transition-opacity duration-500"
                      animate={{ opacity: avatarDropdownOpen ? 0.8 : 0 }}
                    />
                  </motion.button>
                  
                  <AnimatePresence>
                    {avatarDropdownOpen && (
                      <motion.div 
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute top-full right-0 w-56 bg-gradient-to-b from-[#0a1929]/95 to-[#0a1929]/90 rounded-lg py-2 mt-2 z-50 shadow-xl backdrop-blur-md border border-[#1e3a52]/30"
                      >
                        <motion.div 
                          className="px-4 py-3 border-b border-[#1e3a52]/50 mb-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <p className="text-white font-medium">User Name</p>
                          <p className="text-gray-400 text-xs">user@example.com</p>
                        </motion.div>
                        
                        <motion.div variants={staggerMenuItems} initial="hidden" animate="visible">
                          <motion.div variants={menuItemVariants}>
                            <Link 
                              href="/dashboard" 
                              className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#162a3d]/70 hover:text-orange-400 text-sm transition-all duration-200"
                              onClick={() => setAvatarDropdownOpen(false)}
                            >
                              <User size={16} />
                              Dashboard
                            </Link>
                          </motion.div>
                          
                          <motion.div variants={menuItemVariants}>
                            <Link 
                              href="/admin" 
                              className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#162a3d]/70 hover:text-orange-400 text-sm transition-all duration-200"
                              onClick={() => setAvatarDropdownOpen(false)}
                            >
                              <Settings size={16} />
                              Admin
                            </Link>
                          </motion.div>
                          
                          <motion.div variants={menuItemVariants}>
                            <button 
                              onClick={() => {
                                handleLogOut();
                                setAvatarDropdownOpen(false);
                              }}
                              className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-[#162a3d]/70 hover:text-red-300 text-sm w-full text-left transition-all duration-200"
                            >
                              <LogOut size={16} />
                              Logout
                            </button>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="ghost" 
                      className="text-white hover:text-orange-400 hover:bg-[#162a3d]/50 h-9 px-4 text-sm relative group" 
                      asChild
                    >
                      <Link href="/login">
                        Login
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 group-hover:w-full transition-all duration-300"></span>
                      </Link>
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-9 px-5 text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300" 
                      asChild
                    >
                      <Link href="/signup">Sign up</Link>
                    </Button>
                  </motion.div>
                </>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <motion.button 
              className="md:hidden text-white p-1 relative"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="absolute inset-0 rounded-full bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </motion.button>
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
            transition={{ 
              duration: 0.4,
              ease: [0.04, 0.62, 0.23, 0.98] 
            }}
            className="md:hidden bg-gradient-to-b from-[#0a1929]/95 to-[#0a1929]/90 border-t border-[#1e3a52]/30 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-5">
              {/* Mobile Search */}
              <motion.div 
                className="relative mb-5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Input 
                  type="search"
                  placeholder="Find your items..."
                  className="w-full pl-10 h-10 rounded-full bg-[#0a1929]/60 border-[#1e3a52]/50 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring focus:ring-orange-500/20"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </motion.div>
              
              {/* Mobile Navigation */}
              <motion.nav 
                className="space-y-4 mb-6"
                variants={staggerMenuItems}
                initial="hidden"
                animate="visible"
              >
                {navItems.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="py-2"
                    variants={menuItemVariants}
                  >
                    {item.dropdown ? (
                      <div>
                        <motion.button 
                          onClick={() => handleDropdown(item.name + '-mobile')}
                          className="text-white flex justify-between w-full items-center text-base font-medium"
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {item.name}
                          <motion.div
                            animate={{ rotate: activeDropdown === item.name + '-mobile' ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-5 h-5" />
                          </motion.div>
                        </motion.button>
                        
                        <AnimatePresence>
                          {activeDropdown === item.name + '-mobile' && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-2 pl-4 border-l border-[#1e3a52]/50 space-y-2"
                            >
                              {item.items?.map((subItem, subIndex) => (
                                <motion.div
                                  key={subIndex}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: subIndex * 0.1 }}
                                  whileHover={{ x: 5 }}
                                >
                                  <Link 
                                    href={subItem.href} 
                                    className="block py-2 text-gray-300 hover:text-orange-400 text-sm transition-colors duration-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {subItem.name}
                                  </Link>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <motion.div
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link 
                          href={item.href} 
                          className="text-white block text-base font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </motion.nav>
              
              {/* Mobile Action Icons */}
              <motion.div 
                className="flex justify-between mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/notifications" className="text-white flex flex-col items-center" onClick={() => setMobileMenuOpen(false)}>
                    <div className="relative">
                      <Bell className="w-6 h-6 mb-1" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                    </div>
                    <span className="text-xs">Notifications</span>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/messages" className="text-white flex flex-col items-center" onClick={() => setMobileMenuOpen(false)}>
                    <MessageSquare className="w-6 h-6 mb-1" />
                    <span className="text-xs">Messages</span>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/favorites" className="text-white flex flex-col items-center" onClick={() => setMobileMenuOpen(false)}>
                    <Heart className="w-6 h-6 mb-1" />
                    <span className="text-xs">Favorites</span>
                  </Link>
                </motion.div>
              </motion.div>
              
              {/* Mobile Login/Signup */}
              <motion.div 
                className="grid grid-cols-2 gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button 
                    variant="outline" 
                    className="border-[#1e3a52]/70 text-white hover:bg-[#1e3a52]/50 hover:text-orange-400 w-full transition-all duration-300" 
                    asChild
                  >
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white w-full shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300" 
                    asChild
                  >
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign up</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};