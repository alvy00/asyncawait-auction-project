"use client";

import { useState } from "react";
import Image from "next/image";
import { Sidebar, SidebarContent } from "../../../components/ui/sidebar";
import SidebarMenu from "./sidebar-menu";
import { motion } from "framer-motion";

export const AppSidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <Sidebar>
      <SidebarContent className="bg-gradient-to-b from-[#040c16] to-[#0a0a18] text-white relative h-full border-r border-white/5">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex h-16 items-center border-b border-white/10 px-6"
        >
          <Image 
            src="/logo-white.png" 
            alt="AuctaSync Logo" 
            width={120} 
            height={30} 
            className="h-auto w-auto" 
            priority
          />
        </motion.div>
        <div className="px-4 py-4 h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
          <SidebarMenu />
        </div>
      </SidebarContent>
    </Sidebar>
  );
};