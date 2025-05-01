"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, Bell, User } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-md' : 'bg-white/80'} backdrop-blur-md border-b`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="AuctaSync Logo" width={180} height={45}/>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200">Home</Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-orange-500 font-medium flex items-center transition-colors duration-200">
                Auctions
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 hidden group-hover:block w-56 bg-white shadow-xl rounded-lg py-3 mt-1 transition-all duration-200 border border-gray-100">
                <Link href="/auctions/live" className="block px-6 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200">Live Auctions</Link>
                <Link href="/auctions/upcoming" className="block px-6 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200">Upcoming Auctions</Link>
                <Link href="/auctions/past" className="block px-6 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200">Past Auctions</Link>
              </div>
            </div>
            <Link href="/how-it-works" className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200">How it Works</Link>
            <div className="relative">
              <Input 
                type="search"
                placeholder="Search auctions..."
                className="w-64 pl-10 rounded-full border-gray-200 focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 transition-all duration-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 flex items-center justify-center text-gray-600 hover:text-orange-500 hover:bg-orange-50">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" className="font-medium hover:text-orange-500" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 shadow-sm transition-all duration-200" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors" onClick={toggleMenu}>
            {isOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-orange-500 font-medium py-2">Home</Link>
              <div className="border-t border-gray-100 pt-2">
                <p className="text-sm font-medium text-gray-500 mb-2 px-1">Auctions</p>
                <Link href="/auctions/live" className="text-gray-700 hover:text-orange-500 block py-2 pl-3">Live Auctions</Link>
                <Link href="/auctions/upcoming" className="text-gray-700 hover:text-orange-500 block py-2 pl-3">Upcoming Auctions</Link>
                <Link href="/auctions/past" className="text-gray-700 hover:text-orange-500 block py-2 pl-3">Past Auctions</Link>
              </div>
              <Link href="/how-it-works" className="text-gray-700 hover:text-orange-500 font-medium py-2 border-t border-gray-100 pt-4">How it Works</Link>
              <div className="relative border-t border-gray-100 pt-4">
                <Input 
                  type="search"
                  placeholder="Search auctions..."
                  className="w-full pl-10 rounded-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <div className="flex flex-col space-y-2 border-t border-gray-100 pt-4">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="w-full bg-orange-500 hover:bg-orange-600" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};