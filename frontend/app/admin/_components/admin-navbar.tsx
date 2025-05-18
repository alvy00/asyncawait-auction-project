"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { SidebarTrigger } from "../../../components/ui/sidebar";
import { Bell, Home, LogOut, Search, Settings, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "../../../components/ui/separator";
import { motion } from "framer-motion";

const Navbar = () => {
  const path = usePathname();
  const pathSegments = path.split("/").filter(Boolean);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-between h-16 shrink-0 items-center gap-2 border-b border-white/10 px-6 sticky top-0 w-full z-50 backdrop-blur-md bg-[#0a0a18]/70"
    >
      <div className="flex h-16 shrink-0 items-center gap-2">
        <SidebarTrigger className="-ml-2 text-white hover:text-blue-400 transition-colors" />
        <Separator orientation="vertical" className="mx-2 h-5 bg-white/20" />
        <Breadcrumb>
          <BreadcrumbList>
            <li className="flex items-center gap-2">
              <BreadcrumbLink href="/dashboard" className="text-blue-400 hover:text-blue-300 transition-all duration-200">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
              {pathSegments.length > 0 && <BreadcrumbSeparator className="text-white/40" />}
            </li>
            {pathSegments.map((segment, id) => (
              <li key={id} className="flex items-center gap-2">
                {segment.length > 30 ? (
                  "update"
                ) : (
                  <BreadcrumbLink 
                    href={`/${pathSegments.slice(0, id + 1).join('/')}`}
                    className={`transition-all duration-200 hover:text-blue-300 ${id === pathSegments.length - 1 ? "font-medium text-white" : "text-white/70"}`}
                  >
                    {segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </BreadcrumbLink>
                )}
                {pathSegments.length !== id + 1 && <BreadcrumbSeparator className="text-white/40" />}
              </li>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Search Button */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
        >
          <Search className="h-4 w-4" />
        </motion.button>
        
        {/* Notifications */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white relative"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </motion.button>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 p-1.5 text-sm font-medium rounded-full bg-white/5 hover:bg-white/10 transition-colors pr-3"
            >
              <Avatar className="h-7 w-7 border border-white/20">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium text-xs">A</AvatarFallback>
              </Avatar>
              <span className="text-sm text-white hidden sm:inline-block">Admin</span>
              <ChevronDown className="h-3 w-3 text-white/70" />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1 bg-[#0f1225] border border-white/10 text-white">
            <DropdownMenuLabel className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-t-md">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-white/60">admin@panjabiz.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
              <User className="mr-2 h-4 w-4 text-blue-400" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
              <Settings className="mr-2 h-4 w-4 text-blue-400" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
              <Link href={'/'} className="flex items-center w-full">
                <LogOut className="mr-2 h-4 w-4 text-red-400" />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};

export default Navbar;