"use client";

import type React from "react";
import { Navbar } from "../components/Navbar"; // This will now be the header for the main content
import Footer from "../components/Footer";
import Link from "next/link";
// NEW: Import usePathname to track the current route
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Settings, ShoppingBag, Wallet, Heart } from "lucide-react";
import { AnimatedBackground } from "../components/AnimatedBackground";
import toast from "react-hot-toast";
import { useAuth } from "../../lib/auth-context";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";
// NEW: Import clsx for cleaner conditional classes
import clsx from "clsx";
import Image from "next/image";

// Updated sidebar header with logo
const SidebarHeader = () => (
  <div className="p-4 h-[64px] flex items-center justify-center border-b border-white/10">
    <Link href="/" className="flex items-center group">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Image
          src="/logo.svg"
          alt="AuctaSync Logo"
          width={140}
          height={35}
          className="transition-all duration-300 group-hover:brightness-125"
          priority
        />
      </motion.div>
    </Link>
  </div>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();
  const router = useRouter();
  // NEW: Get the current path to determine the active link
  const pathname = usePathname();

  const handleLogOut = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "My Auctions", href: "/dashboard/my-auctions", icon: <ShoppingBag className="h-5 w-5" /> },
    { name: "My Bids", href: "/dashboard/my-bids", icon: <Heart className="h-5 w-5" /> },
    { name: "Wallet", href: "/dashboard/wallet", icon: <Wallet className="h-5 w-5" /> },
  ];

  const accountItems = [
    { name: "Account Settings", href: "/dashboard/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen w-full bg-[#040c16] text-gray-200 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#040c16] via-[#0a1929] to-[#1a202c]" />
        
        {/* Enhanced animated blobs */}
        <motion.div
          className="absolute top-[-20%] left-[-15%] w-[500px] h-[500px] bg-gradient-to-r from-orange-500/15 to-pink-500/10 rounded-full filter blur-[120px]"
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.6, 0.8, 0.6],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-[-20%] right-[-15%] w-[600px] h-[600px] bg-gradient-to-l from-purple-500/12 to-blue-500/8 rounded-full filter blur-[130px]"
          animate={{ 
            scale: [1, 1.1, 1], 
            opacity: [0.4, 0.7, 0.4],
            x: [0, -40, 0],
            y: [0, 30, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 18,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-gradient-to-br from-teal-400/10 to-cyan-500/8 rounded-full filter blur-[80px]"
          animate={{ 
            scale: [1, 1.3, 1], 
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute bottom-[40%] left-[10%] w-[250px] h-[250px] bg-gradient-to-tr from-yellow-400/8 to-orange-500/12 rounded-full filter blur-[70px]"
          animate={{ 
            scale: [1, 0.8, 1], 
            opacity: [0.5, 0.8, 0.5],
            x: [0, 50, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 12,
            ease: "easeInOut"
          }}
        />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 bg-noise opacity-10" />
      </div>

      {/* Sidebar - Full height, fixed width */}
      <motion.aside
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        // Enhanced backdrop blur and border
        className="w-64 flex-shrink-0 bg-gradient-to-b from-[#040c16]/80 to-[#040c16]/60 backdrop-blur-xl flex flex-col z-20 border-r border-white/20 shadow-2xl"
      >
        <SidebarHeader />

        {/* Navigation links - takes up available space */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                // NEW: Using clsx for clean conditional classes
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group",
                  {
                    "bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-white shadow-lg": isActive,
                    "text-gray-300 hover:bg-white/10 hover:text-white": !isActive,
                  }
                )}
              >
                <span className={clsx("transition-colors", { "text-orange-400": isActive })}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Account and Logout section - pushed to the bottom */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {accountItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-300"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
          <Button
            onClick={handleLogOut}
            variant="ghost" // Using a ghost variant for better semantics
            className="w-full flex items-center justify-start gap-3 px-4 py-3 text-gray-300 hover:bg-red-500/20 hover:text-white rounded-lg transition-all duration-300"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto relative z-10">
        {/* The Navbar from your original code now acts as a sticky header for the content */}
        {/* <header className="w-full z-10 sticky top-0">
          <Navbar />
        </header> */}

        {/* Main content - flex-1 to push footer down */}
        <main className="flex-1">
          {/* We add more padding to the content area itself */}
          <section className="p-6 md:p-8">
            {children}
          </section>
        </main>
        
        {/* Footer sticks to the bottom of the content area */}
        <Footer />
      </div>
    </div>
  );
}