/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "../../components/ui/button"
import { Menu, X, Bell, ChevronDown, LogOut, Settings, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HiOutlineUserAdd } from "react-icons/hi"
import { CiLogin } from "react-icons/ci"
import { MdDashboard, MdOutlineCreateNewFolder } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6"
import { User } from "../../lib/interfaces"
import toast from "react-hot-toast"
import { useAuth } from "../../lib/auth-context"
import { useUser } from "../../lib/user-context"

export const Navbar = () => {
  const { user, refetchIndex, isLoading } = useUser()
  const [isScrolled, setIsScrolled] = useState(false)
  const { loggedIn, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [auctionsDropdownOpen, setAuctionsDropdownOpen] = useState(false)
  const [mobileAuctionsOpen, setMobileAuctionsOpen] = useState(false)
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const router = useRouter()

  const avatarDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && !(event.target as Element).closest(".mobile-menu-container")) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

  // desktop outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        avatarDropdownOpen &&
        avatarDropdownRef.current &&
        !avatarDropdownRef.current.contains(event.target as Node)
      ) {
        setAvatarDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [avatarDropdownOpen]);

  const handleLogOut = () => {
    logout();
    toast.success('Logged out successfully')
    router.push('/');
  };

  const navItems = [
    { name: "Home", href: "/" },
    {
      name: "Auctions",
      href: "#",
      dropdown: true,
      items: [
        { name: "Live Auctions", href: "/auctions/live" },
        { name: "Upcoming Auctions", href: "/auctions/upcoming" },
        { name: "Past Auctions", href: "/auctions/past" },
      ],
    },
    { name: "How it works", href: "/how-it-works" },
    { name: "Leaderboards", href: "/leaderboards" },
    { name: "Contact", href: "/contact" },
  ]

  const handleMobileNavClick = (href: string) => {
    setMobileMenuOpen(false)
    setMobileAuctionsOpen(false)
    if (href !== "#") {
      router.push(href)
    }
  }

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      } 
    },
    exit: { 
      opacity: 0, 
      y: 10, 
      scale: 0.95,
      transition: { 
        duration: 0.2 
      } 
    }
  };

  const staggerMenuItems = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      } 
    },
  };

  const maxWidth6xl = 72 * 16;
  const maxWidth7xl = 78 * 16;
  useEffect(() => {
    setHasLoaded(true);
  }, []);


  return (
    <>
      <motion.header
        initial={{ maxWidth: maxWidth6xl }}
        animate={{ maxWidth: hasLoaded ? maxWidth7xl : maxWidth6xl }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{
          width: "95vw",
          left: "50%",
          transform: "translateX(-50%)",
          position: "fixed",
          borderRadius: "1rem",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
          zIndex: 50,
          backgroundColor: "rgba(24, 24, 27, 0.9)",
        }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center justify-between h-[64px] px-4 sm:px-8 relative z-50"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center group z-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Image
                src="/logo.svg"
                alt="AuctaSync Logo"
                width={160}
                height={40}
                className="transition-all duration-300 group-hover:brightness-125"
                priority
              />
            </motion.div>
          </Link>

          {/* Nav links - desktop */}
          <nav className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item, idx) =>
              item.dropdown ? (
                <div key={item.name} className="relative group">
                  <button
                    className="px-4 py-2 rounded-full text-sm font-semibold text-white/90 hover:text-white transition-all duration-200 bg-white/0 hover:bg-white/10 focus:bg-white/10 focus:text-white outline-none flex items-center gap-1"
                    onMouseEnter={() => setAuctionsDropdownOpen(true)}
                    onMouseLeave={() => setAuctionsDropdownOpen(false)}
                    onClick={() => setAuctionsDropdownOpen((v) => !v)}
                    aria-haspopup="true"
                    aria-expanded={auctionsDropdownOpen}
                  >
                    {item.name}
                    <motion.span
                      animate={{ rotate: auctionsDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {auctionsDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 min-w-[200px] bg-[#18181b]/95 rounded-xl shadow-xl border border-white/10 backdrop-blur-lg flex flex-col py-3 gap-1 z-50"
                        onMouseEnter={() => setAuctionsDropdownOpen(true)}
                        onMouseLeave={() => setAuctionsDropdownOpen(false)}
                      >
                        {item.items.map((sub) => (
                          <motion.div
                            key={sub.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Link
                              href={sub.href}
                              className="block px-5 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-white rounded-md mx-2 transition-all duration-150"
                            >
                              {sub.name}
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white/90 hover:text-white transition-all duration-200 bg-white/0 hover:bg-white/10 focus:bg-white/10 focus:text-white outline-none"
                  style={{ fontWeight: idx === 0 ? 700 : 500 }}
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          {/* Actions - desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoading ? (
              // Skeleton while loading
              <div className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <div className="w-8 h-8 rounded-full bg-white/10" />
              </div>
            ) : loggedIn ? (
              // Authenticated user
              <motion.div
                ref={avatarDropdownRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative flex items-center gap-3"
              >
                {/* Notification Button */}
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 cursor-pointer">
                  <Bell className="w-4 h-4" />
                </Button>

                {/* Favorites */}
                <Link href="/favourites">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 cursor-pointer">
                    <Heart className="w-4 h-4" />
                  </Button>
                </Link>

                {/* Settings */}
                <Link href="/dashboard/settings">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 cursor-pointer">
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
                
                {/* Avatar Button */}
                <button
                  onClick={() => setAvatarDropdownOpen((v) => !v)}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-sm cursor-pointer relative overflow-hidden"
                  aria-label="User menu"
                >
                  {user?.name
                    ? user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                    : "U"}
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {avatarDropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-1/2 transform -translate-x-1/2 w-56 bg-gradient-to-b from-[#0a1929]/95 to-[#0a1929]/90 rounded-lg py-2 mt-2 z-50 shadow-xl backdrop-blur-md border border-[#1e3a52]/30"
                    >
                      <motion.div
                        className="px-4 py-3 border-b border-[#1e3a52]/50 mb-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <p className="text-white font-medium">{user?.name}</p>
                        <p className="text-gray-400 text-xs">{user?.email}</p>
                      </motion.div>

                      <motion.div variants={staggerMenuItems} initial="hidden" animate="visible">
                        <motion.div variants={menuItemVariants}>
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#162a3d]/70 hover:text-orange-400 text-sm transition-all duration-200"
                            onClick={() => setAvatarDropdownOpen(false)}
                          >
                            <MdDashboard className="text-lg" />
                            Dashboard
                          </Link>
                        </motion.div>

                        {user?.is_admin && (
                          <motion.div variants={menuItemVariants}>
                            <Link
                              href="/admin"
                              className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#162a3d]/70 hover:text-orange-400 text-sm transition-all duration-200"
                              onClick={() => setAvatarDropdownOpen(false)}
                            >
                              <Settings size={16} />
                              Admin
                            </Link>
                          </motion.div>
                        )}

                        <motion.div variants={menuItemVariants}>
                          <Link
                            href="/auctions/create"
                            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#162a3d]/70 hover:text-orange-400 text-sm transition-all duration-200"
                            onClick={() => setAvatarDropdownOpen(false)}
                          >
                            <MdOutlineCreateNewFolder className="text-lg" />
                            Create Auction
                          </Link>
                        </motion.div>

                        <motion.div variants={menuItemVariants}>
                          <button
                            onClick={() => {
                              handleLogOut()
                              setAvatarDropdownOpen(false)
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-700/30 hover:text-red-300 text-sm w-full text-left transition-colors duration-200 cursor-pointer rounded"
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>

            ) : (
              // Unauthenticated user
              <motion.div className="flex items-center gap-4">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <Button 
                    variant="ghost" 
                    className="text-white hover:text-orange-400 hover:bg-[#162a3d]/50 h-9 px-4 text-sm relative group" 
                    asChild
                  >
                    <Link href="/login">
                      {/* <CiLogin className="text-sm" /> */}
                      Login
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.45 }}
                >
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg flex items-center gap-2 cursor-pointer">
                      <motion.span
                        initial={{ x: -6, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.35, duration: 0.3 }}
                      >
                        Get Started
                      </motion.span>
                      <motion.span
                        initial={{ x: 6, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.45, duration: 0.3 }}
                      >
                        <FaArrowRightLong />
                      </motion.span>
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Hamburger - mobile */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 z-10"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="mobile-menu-container fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#18181b]/98 backdrop-blur-xl border-l border-white/10 z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-6 py-6">
                  <div className="space-y-2">
                    {navItems.map((item, idx) =>
                      item.dropdown ? (
                        <div key={item.name} className="space-y-2">
                          <button
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                            onClick={() => setMobileAuctionsOpen((v) => !v)}
                            aria-expanded={mobileAuctionsOpen}
                          >
                            <span>{item.name}</span>
                            <ChevronDown
                              className={`w-5 h-5 transition-transform duration-200 ${
                                mobileAuctionsOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {mobileAuctionsOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-4 space-y-1 overflow-hidden"
                              >
                                {item.items.map((sub) => (
                                  <button
                                    key={sub.name}
                                    onClick={() => handleMobileNavClick(sub.href)}
                                    className="w-full text-left px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200"
                                  >
                                    {sub.name}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <button
                          key={item.name}
                          onClick={() => handleMobileNavClick(item.href)}
                          className="w-full text-left px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                          style={{ fontWeight: idx === 0 ? 700 : 500 }}
                        >
                          {item.name}
                        </button>
                      ),
                    )}
                  </div>
                </nav>

                {/* Actions */}
                <div className="p-6 border-t border-white/10 space-y-3">
                  {loggedIn ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold">
                          {user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user?.name || "User"}</p>
                          <p className="text-white/60 text-sm">{user?.email}</p>
                        </div>
                      </div>

                      {/* Notif, Fav, settings icon */}
                      <div className="w-full px-4 py-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                          {/* Notifications */}
                          <Button
                            variant="ghost"
                            className="flex items-center justify-start gap-2 text-white hover:bg-white/10 transition rounded-full py-2"
                          >
                            <Bell className="w-5 h-5" />
                            <span className="text-sm">Notifications</span>
                          </Button>

                          {/* Favourites */}
                          <Link href="/favourites">
                            <Button
                              variant="ghost"
                              className="flex items-center justify-start gap-2 text-white hover:bg-white/10 transition rounded-full py-2 w-full"
                            >
                              <Heart className="w-5 h-5" />
                              <span className="text-sm">Favourites</span>
                            </Button>
                          </Link>

                          {/* Settings */}
                          <Link href="/dashboard/settings">
                            <Button
                              variant="ghost"
                              className="flex items-center justify-start gap-2 text-white hover:bg-white/10 transition rounded-full py-2"
                            >
                              <Settings className="w-5 h-5" />
                              <span className="text-sm">Settings</span>
                            </Button>
                          </Link>

                        </div>
                      </div>

                      {/* Login & Sign up */}
                      <Button
                        variant="ghost"
                        className="w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 justify-start"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        onClick={() => handleMobileNavClick("/login")}
                        variant="ghost"
                        className="w-full text-white hover:bg-white/10 font-semibold justify-center"
                      >
                        <CiLogin className="w-5 h-5 mr-2" />
                        Login
                      </Button>
                      <Button
                        onClick={() => handleMobileNavClick("/signup")}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg justify-center"
                      >
                        <HiOutlineUserAdd className="w-5 h-5 mr-2" />
                        Sign up
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
