"use client";

import { useState } from "react";
import Image from "next/image";
import { Sidebar, SidebarContent } from "../../../components/ui/sidebar";
import SidebarMenu from "./sidebar-menu";

export const AppSidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <Sidebar>
      <SidebarContent className="bg-[#0a0a18] text-white relative h-full">
        <div className="flex h-16 items-center border-b border-gray-800 px-6">
          <Image 
            src="/logo-white.png" 
            alt="AuctaSync Logo" 
            width={120} 
            height={30} 
            className="h-auto w-auto" 
          />
        </div>
        <div className="px-4 py-4">
          <SidebarMenu />
        </div>
      </SidebarContent>
    </Sidebar>
  );
};