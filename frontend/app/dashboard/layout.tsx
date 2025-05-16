"use client";

import type React from "react"; // Import React
import { AppSidebar } from "./_components/app-sidebar";
import { Navbar } from "../components/Navbar";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import Footer from "../components/Footer";
import Link from "next/link";
import { LayoutDashboard, LogOut, Settings, ShoppingBag, Wallet } from "lucide-react";
import { AnimatedBackground } from "../components/AnimatedBackground";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full relative">
        <AnimatedBackground />
        {/* Navbar at the top */}
        <div className="w-full z-10 sticky top-0">
          <Navbar />
        </div>
        
        <div className="flex flex-1">
          {/* Sidebar on the left */}
          {/* <AppSidebar /> */}
          <aside className="w-48 bg-[#040c16]/50 hidden md:block sticky top-[64px] self-start h-[calc(100vh-64px)]">
            <div className="p-4 space-y-6">
              <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 bg-[#7b62fb]/20 text-white rounded-md">
                <LayoutDashboard className="h-5 w-5 text-[#7b62fb]" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/my-auctions"
                className="flex items-center gap-2 px-3 py-2 text-white hover:bg-[#07244d]/20 rounded-md"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>My Auctions</span>
              </Link>
              <Link
                href="/my-bids"
                className="flex items-center gap-2 px-3 py-2 text-white hover:bg-[#07244d]/20 rounded-md"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>My Bids</span>
              </Link>
              <Link
                href="/wallet"
                className="flex items-center gap-2 px-3 py-2 text-white hover:bg-[#07244d]/20 rounded-md"
              >
                <Wallet className="h-5 w-5" />
                <span>Wallet</span>
              </Link>
            </div>

            <div className="mt-auto p-4 border-t border-[#07244d]/30 space-y-2">
              <Link
                href="/settings"
                className="flex items-center gap-2 px-3 py-2 text-white hover:bg-[#07244d]/20 rounded-md"
              >
                <Settings className="h-5 w-5" />
                <span>Account Setting</span>
              </Link>
              <Link
                href="/logout"
                className="flex items-center gap-2 px-3 py-2 text-white hover:bg-[#07244d]/20 rounded-md"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Link>
            </div>
          </aside>
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col">
            <main className="flex-1">
              <section className="p-4">
                {children}
              </section>
            </main>
          </div>
        </div>
        
        {/* Footer at the bottom */}
        <div className="w-full mt-auto">
          <Footer />
        </div>
      </div>
    // </SidebarProvider>
  );
}

