/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "../../components/ui/button";
import { Input } from '../../components/ui/input';
import { Search, Menu, X, Bell, User, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import toast from 'react-hot-toast';
import { Info } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { loggedIn, logout } = useAuth();
  const toggleMenu = () => setIsOpen(!isOpen);
  const router = useRouter();

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

  useEffect(() => {
    
  }, [])

  const handleLogOut = () => {
    logout();
    toast.success('Logged out successfully')
    router.push('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-md' : 'bg-white/80'} backdrop-blur-md border-b`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="AuctaSync Logo" width={180} height={45}/>
          </Link>

          {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-10 px-6">
        {/* Logo or Home */}
        <Link
          href="/"
          className="text-gray-800 hover:text-orange-500 font-semibold text-base transition-colors"
        >
          Home
        </Link>

        {/* Auctions Dropdown */}
        <div className="relative group">
          <button
            className="flex items-center text-gray-800 font-semibold text-base hover:text-orange-500 transition-colors"
          >
            Auctions
            <svg
              className="w-4 h-4 ml-1 mt-[1px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className="absolute z-20 left-0 mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-100 py-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200"
          >
            <Link
              href="/auctions/live"
              className="block px-5 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition"
            >
              Live Auctions
            </Link>
            <Link
              href="/auctions/upcoming"
              className="block px-5 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition"
            >
              Upcoming Auctions
            </Link>
            <Link
              href="/auctions/past"
              className="block px-5 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition"
            >
              Past Auctions
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <Link
          href="/how-it-works"
          className="text-gray-800 hover:text-orange-500 font-semibold text-base transition-colors"
        >
          How it Works
        </Link>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xs">
          <Input
            type="search"
            placeholder="Search auctions..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:ring-orange-300 focus:border-orange-400 transition"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        {/* Icons and Auth */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10 text-gray-600 hover:text-orange-500 hover:bg-orange-100"
          >
            <Bell className="h-5 w-5" />
          </Button>

          {loggedIn ? (
            <>
              <Button variant="ghost" className="font-medium hover:text-orange-500" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition"
                onClick={handleLogOut}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="font-medium hover:text-orange-500" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition"
                asChild
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>


          {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className="inline-flex items-center justify-center lg:hidden p-2 rounded-md text-gray-700 hover:text-orange-500 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
              onClick={toggleMenu}
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 px-4 border-t border-gray-100 space-y-6 bg-white shadow-md">
            <div className="flex flex-col space-y-4">

              {/* Home */}
              <Link
                href="/"
                className="flex items-center text-sm font-medium text-gray-800 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-md transition-colors duration-200"
              >
                <Home className="w-4 h-4 text-gray-600 mr-2" />
                Home
              </Link>

              {/* Auctions */}
              <div className="border-t border-gray-100 pt-5">
                <div className="bg-gray-50 rounded-xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-6h13M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                    <p className="text-xs uppercase tracking-wide font-semibold text-gray-600">
                      Auctions
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/auctions/live"
                      className="block text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-md px-3 py-2 transition-colors"
                    >
                      Live Auctions
                    </Link>
                    <Link
                      href="/auctions/upcoming"
                      className="block text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-md px-3 py-2 transition-colors"
                    >
                      Upcoming Auctions
                    </Link>
                    <Link
                      href="/auctions/past"
                      className="block text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-md px-3 py-2 transition-colors"
                    >
                      Past Auctions
                    </Link>
                  </div>
                </div>
              </div>

              {/* How it Works */}
              <div className="border-t border-gray-100 pt-4">
                <Link
                  href="/how-it-works"
                  className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-md transition-colors duration-200"
                >
                  <Info className="w-4 h-4 text-orange-400" />
                  How it Works
                </Link>
              </div>

              {/* Search */}
              <div className="relative border-t border-gray-100 pt-4">
                <div className="relative w-full">
                  <Input
                    type="search"
                    placeholder="Search auctions..."
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-sm shadow-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:ring-opacity-50 transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Auth Section */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                {loggedIn ? (
                  <>
                    <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-orange-500 transition" asChild>
                      <Link href="/profile">Profile</Link>
                    </Button>
                    <Button
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition"
                      onClick={handleLogOut}
                    >
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Login Button */}
                    <Button
                      variant="ghost"
                      className="w-full justify-center text-gray-700 hover:text-orange-500 hover:bg-orange-50 font-medium rounded-full transition-all duration-200 shadow-sm"
                      asChild
                    >
                      <Link href="/login">Login</Link>
                    </Button>

                    {/* Sign Up Button */}
                    <Button
                      className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-full shadow-md transition-all duration-200"
                      asChild
                    >
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
};