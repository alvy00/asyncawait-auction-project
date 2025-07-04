
"use client";

import type React from "react";
import { AppSidebar } from "./_components/app-sidebar";
import Navbar from "./_components/admin-navbar";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import { AnimatedBackground } from "../components/AnimatedBackground";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full relative bg-[#0a0a18]">
        <AnimatedBackground/>
        <AppSidebar />
        <div className="flex-1 overflow-auto bg-transparent">
          <SidebarInset className="bg-transparent pt-0 px-0 pb-0">
            <Navbar />
            <section className="bg-transparent pt-0 px-0 pb-0">
              {children}
            </section>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}