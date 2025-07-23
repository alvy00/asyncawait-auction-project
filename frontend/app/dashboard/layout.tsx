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

// A good practice is to have a logo or brand name in the sidebar header
const SidebarHeader = () => (
  <div className="p-4 h-[64px] flex items-center justify-center border-b border-white/10">
    <Link href="/dashboard" className="text-xl font-bold text-white">
      User Dashboard
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
    // CHANGED: The main container is now a horizontal flexbox filling the screen height
    <div className="flex h-screen w-full bg-[#040c16] text-gray-200">
      <AnimatedBackground />

      {/* Sidebar - Full height, fixed width */}
      <motion.aside
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        // CHANGED: The sidebar is now a flex column taking the full screen height.
        className="w-64 flex-shrink-0 bg-gradient-to-b from-[#040c16]/70 to-[#040c16]/50 backdrop-blur-md flex flex-col z-20 border-r border-white/10"
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
      {/* CHANGED: This wrapper takes the remaining space and handles its own vertical scrolling */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* The Navbar from your original code now acts as a sticky header for the content */}
        <header className="w-full z-10 sticky top-0">
          <Navbar />
        </header>

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