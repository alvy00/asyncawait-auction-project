"use client";

import { cn } from "../../../lib/utils";
import {
  Aperture,
  Box,
  CalendarDays,
  CircleUser,
  Heart,
  Layers,
  LayoutDashboard,
  Send,
  Users,
  FolderTree,
  Percent,
  Truck
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX, useState } from "react";

interface AdminMenuItem {
  title: string;
  items: { title: string; url: string }[];
  icon?: JSX.Element;
}

interface CustomerMenuItem {
  label: string;
  href: string;
  icon: JSX.Element;
}
// admin menu
const menuItems: AdminMenuItem[] = [
  {
    title: "Auctions",
    items: [
      { title: "All Auctions", url: "/dashboard/admin/auctions" },
      { title: "Create Auction", url: "/dashboard/admin/auctions/create" },
    ],
    icon: <Box size={20} />,
  },
  {
    title: "Categories",
    items: [
      { title: "All Categories", url: "/dashboard/admin/categories" },
    ],
    icon: <FolderTree size={20} />,
  },
  {
    title: "Users",
    items: [{ title: "All Users", url: "/dashboard/admin/users" }],
    icon: <Users size={20} />,
  },
  {
    title: "Bids",
    items: [
      { title: "All Orders", url: "/dashboard/admin/orders" },
      { title: "Pending Orders", url: "/dashboard/admin/orders?status=PENDING" },
    ],
    icon: <Box size={20} />,
  },
  {
    title: "Transactions",
    items: [
      { title: "Manage Minimum Order Advances", url: "/dashboard/admin/minimum-order-advance", },
    ],
    icon: <Percent className="h-5 w-5" />,
  },
  {
    title: "Reports & Analytics",
    items: [
      { title: "Active Promotions", url: "/dashboard/admin/active-promotions" },
      { title: "Create Promotion", url: "/dashboard/admin/promotions" },
    ],
    icon: <Layers size={20} />,
  },
  {
    title: "Site Settings",
    items: [{ title: "Manage Banners", url: "/dashboard/admin/banners" }],
    icon: <Send size={20} />,
  },
  {
    title: "Content Management",
    items: [
      { title: "Manage Shipping", url: "/dashboard/admin/shipping" },
    ],
    icon: <Truck size={20} />,
  }
];
// customer menu
const customerItems: CustomerMenuItem[] = [
  {
    label: "My Auctions",
    href: "/dashboard/auctions",
    icon: <CalendarDays size={20} />,
  },
  {
    label: "My Bids",
    href: "/dashboard/bids",
    icon: <CircleUser size={20} />,
  },
  {
    label: "Wallet",
    href: "/dashboard/wallet",
    icon: <Heart size={20} />,
  },
];

export default function SidebarMenu() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const pathname = usePathname();
  const toggleItem = (title: string) => {
    setOpenItem(openItem === title ? null : title);
  };

  return (
    <nav className="space-y-6">
      {pathname.startsWith("/dashboard/admin") ? (
        <ul className="space-y-3">
          <li
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-gray-700 cursor-pointer",
              pathname === "/dashboard/admin"
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
            )}
          >
            <Link className="flex gap-2 items-center" href="/dashboard/admin">
              <LayoutDashboard size={20} />
              <span>Overview</span>
            </Link>
          </li>
          {menuItems.map((item, id) => (
            <li key={id}>
              <button
                onClick={() => toggleItem(item.title)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-secondary hover:text-secondary-foreground transition-colors "
              >
                <span className="flex gap-2 items-center">
                  {item.icon}
                  {item.title}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openItem === item.title ? "rotate-60" : "-rotate-90"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  openItem === item.title
                    ? "max-h-48 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <ul className="mt-1 space-y-1">
                  {item.items.map((subItem, id) => (
                    <li key={id} className="cursor-pointer">
                      <Link
                        href={subItem.url}
                        className={`block px-6 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100 transition-colors ${
                          pathname === subItem.url
                            ? "bg-secondary text-secondary-foreground"
                            : "hover:bg-secondary hover:text-secondary-foreground"
                        }`}
                      >
                        {subItem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
          <p className="px-3 text-xs text-gray-500">Help</p>
          <li
            className={cn(
              "flex items-center cursor-pointer gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-gray-700",
              pathname === ""
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
            )}
          >
            <Link className="flex items-center gap-2" href="#">
              <Aperture size={20} /> <span>Support</span>
            </Link>
          </li>
          <li
            className={cn(
              "flex items-center cursor-pointer gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-gray-700",
              pathname === ""
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
            )}
          >
            <Link className="flex items-center gap-2" href="#">
              <Send size={20} /> <span>Feddback</span>
            </Link>
          </li>
        </ul>
      ) : (
        <ul className="space-y-3">
          {customerItems.map((item, id) => (
            <li
              key={id}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
            >
              <Link className="flex items-center gap-2" href={item.href}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}