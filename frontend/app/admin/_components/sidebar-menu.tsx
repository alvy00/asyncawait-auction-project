"use client";

import { cn } from "../../../lib/utils";
import {
  Box,
  Layers,
  LayoutDashboard,
  Send,
  Users,
  FolderTree,
  Percent,
  Truck,
  ChevronDown,
  HelpCircle,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX, useState } from "react";
import { motion } from "framer-motion";

interface AdminMenuItem {
  title: string;
  items: { title: string; url: string }[];
  icon?: JSX.Element;
}

// admin menu
const menuItems: AdminMenuItem[] = [
  {
    title: "Auctions",
    items: [
      { title: "All Auctions", url: "/admin/auctions" },
      { title: "Create Auction", url: "/admin/auctions/create" },
    ],
    icon: <Box size={20} />,
  },
  {
    title: "Categories",
    items: [
      { title: "All Categories", url: "/admin/categories" },
    ],
    icon: <FolderTree size={20} />,
  },
  {
    title: "Users",
    items: [{ title: "All Users", url: "/admin/users" }],
    icon: <Users size={20} />,
  },
  {
    title: "Bids",
    items: [
      { title: "All Bids", url: "/admin/bids" },
      { title: "Ongoing Bids", url: "/admin/bids?status=ongoing" },
    ],
    icon: <Box size={20} />,
  },
  {
    title: "Transactions",
    items: [
      { title: "Manage Transactions", url: "/admin/transactions", },
    ],
    icon: <Percent className="h-5 w-5" />,
  },
  {
    title: "Reports & Analytics",
    items: [
      { title: "Overall Analytics", url: "/admin/analytics" },
    ],
    icon: <Layers size={20} />,
  },
  {
    title: "Site Settings",
    items: [{ title: "Edit Site", url: "/admin/site" }],
    icon: <Send size={20} />,
  },
  {
    title: "Content Management",
    items: [
      { title: "Manage Contents", url: "/admin/content" },
    ],
    icon: <Truck size={20} />,
  }
];

export default function SidebarMenu() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const pathname = usePathname();
  
  const toggleItem = (title: string) => {
    setOpenItem(openItem === title ? null : title);
  };

  return (
    <nav className="space-y-6">
      <motion.ul 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, staggerChildren: 0.1 }}
        className="space-y-2"
      >
        <motion.li
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
            pathname === "/dashboard/admin"
              ? "bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-white"
              : "text-gray-300 hover:bg-white/5 hover:text-white"
          )}
        >
          <Link className="flex gap-2 items-center w-full" href="/dashboard/admin">
            <LayoutDashboard size={18} className={pathname === "/dashboard/admin" ? "text-orange-400" : ""} />
            <span>Overview</span>
          </Link>
        </motion.li>
        
        {menuItems.map((item, id) => (
          <motion.li 
            key={id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: id * 0.05 }}
          >
            <button
              onClick={() => toggleItem(item.title)}
              className={`flex items-center justify-between w-full px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                openItem === item.title 
                  ? "bg-white/10 text-white" 
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="flex gap-2 items-center">
                <span className={openItem === item.title ? "text-blue-400" : ""}>
                  {item.icon}
                </span>
                {item.title}
              </span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-200 ${
                  openItem === item.title ? "rotate-180" : ""
                }`}
              />
            </button>
            
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: openItem === item.title ? "auto" : 0,
                opacity: openItem === item.title ? 1 : 0
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <ul className="mt-1 space-y-1 pl-7 pr-2">
                {item.items.map((subItem, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                  >
                    <Link
                      href={subItem.url}
                      className={`block px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                        pathname === subItem.url
                          ? "bg-blue-500/10 text-blue-400"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {subItem.title}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.li>
        ))}
        
        <div className="pt-4 mt-4 border-t border-white/10">
          <p className="px-3 text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Support</p>
          
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center cursor-pointer gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 text-gray-300 hover:bg-white/5 hover:text-white"
          >
            <Link className="flex items-center gap-2 w-full" href="#">
              <HelpCircle size={18} /> 
              <span>Help Center</span>
            </Link>
          </motion.li>
          
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center cursor-pointer gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 text-gray-300 hover:bg-white/5 hover:text-white"
          >
            <Link className="flex items-center gap-2 w-full" href="#">
              <MessageSquare size={18} /> 
              <span>Feedback</span>
            </Link>
          </motion.li>
        </div>
      </motion.ul>
    </nav>
  );
}