"use client";

import type React from "react";
import Footer from "../components/Footer";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Settings, ShoppingBag, Wallet, Heart, Menu } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../lib/auth-context";
import { Button } from "../../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

// SidebarHeader
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
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogOut = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
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
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#040c16] via-[#0a1929] to-[#1a202c]" />
        {/* Animated blobs omitted for brevity */}
      </div>

      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6 text-white" />
        </Button>
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <AnimatePresence>
        {(mobileOpen || typeof window !== "undefined") && (
          <motion.aside
            key="sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className={clsx(
              "fixed md:relative z-30 md:z-20 top-0 left-0 h-full w-64 bg-gradient-to-b from-[#040c16]/80 to-[#040c16]/60 backdrop-blur-xl border-r border-white/20 shadow-2xl flex flex-col",
              { "md:flex hidden": !mobileOpen }
            )}
          >
            <SidebarHeader />

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group",
                      {
                        "bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-white shadow-lg": isActive,
                        "text-gray-300 hover:bg-white/10 hover:text-white": !isActive,
                      }
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className={clsx({ "text-orange-400": isActive })}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/10 space-y-2">
              {accountItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              ))}
              <Button
                onClick={handleLogOut}
                variant="ghost"
                className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-red-500/20 transition-all duration-300"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Log Out</span>
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay on mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto relative z-10">
        <main className="flex-1">
          <section className="p-6 md:p-8">{children}</section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
