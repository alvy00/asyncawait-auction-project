"use client";

import type React from "react";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { LayoutDashboard, LogOut, Settings, ShoppingBag, Wallet, Bell, Heart } from "lucide-react";
import { AnimatedBackground } from "../components/AnimatedBackground";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();
  const router = useRouter();
  
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
    <div className="flex flex-col min-h-screen w-full relative">
      <AnimatedBackground />
      
      {/* Navbar */}
      <div className="w-full z-10 sticky top-0">
        <Navbar />
      </div>
      
      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-56 bg-gradient-to-b from-[#040c16]/70 to-[#040c16]/50 backdrop-blur-sm hidden md:block sticky top-[64px] self-start h-[calc(100vh-64px)] border-r border-white/5"
        >
          <div className="p-5 space-y-1">
            {menuItems.map((item, index) => (
              <Link 
                key={item.name}
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${item.href === '/dashboard' 
                  ? 'bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-white' 
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
              >
                <span className={item.href === '/dashboard' ? 'text-orange-400' : ''}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="mt-auto p-5 border-t border-white/10 space-y-1">
            {accountItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href} 
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-all duration-300"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            
            <Button
              onClick={handleLogOut}
              className="w-full flex items-center justify-start gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-all duration-300 bg-transparent hover:bg-transparent"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </div>
        </motion.aside>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1">
            <section className="p-4 md:p-6">
              {children}
            </section>
          </main>
        </div>
      </div>
      
      {/* Footer */}
      <div className="w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
}

