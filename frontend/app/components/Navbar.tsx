"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "../../components/ui/button"
import { Menu, X, Bell, ChevronDown, LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HiOutlineUserAdd } from "react-icons/hi"
import { CiLogin } from "react-icons/ci"

interface User {
  id: string
  name: string
  email: string
}

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState<User>()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [auctionsDropdownOpen, setAuctionsDropdownOpen] = useState(false)
  const [mobileAuctionsOpen, setMobileAuctionsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken")
      if (!token) return
      try {
        const res = await fetch("https://asyncawait-auction-project.onrender.com/api/getuser", {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        setUser(data)
        setLoggedIn(true)
      } catch {}
    }
    getUser()
  }, [])

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

  return (
    <>
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-6xl rounded-2xl transition-all duration-500 ${
          isScrolled ? "bg-[#18181b]/95" : "bg-[#18181b]/85"
        } border border-white/10 shadow-xl backdrop-blur-xl`}
      >
        <div className="flex items-center justify-between h-[64px] px-4 sm:px-8">
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
                    <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                  </button>
                  {/* Desktop Dropdown */}
                  <AnimatePresence>
                    {auctionsDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 min-w-[180px] bg-[#18181b]/95 rounded-xl shadow-lg border border-white/10 backdrop-blur-xl flex flex-col py-2 z-50"
                        onMouseEnter={() => setAuctionsDropdownOpen(true)}
                        onMouseLeave={() => setAuctionsDropdownOpen(false)}
                      >
                        {item.items.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="px-5 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-white rounded-lg mx-2 transition-all duration-150"
                          >
                            {sub.name}
                          </Link>
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
              ),
            )}
          </nav>

          {/* Actions - desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {loggedIn ? (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Settings className="w-4 h-4" />
                </Button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user?.name?.charAt(0) || "U"}
                </div>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/70 font-semibold cursor-pointer">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-gradient-to-r cursor-pointer from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger - mobile & tablet */}
          <button
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
          </button>
        </div>
      </header>

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
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="ghost" className="text-white hover:bg-white/10 justify-start">
                          <Bell className="w-4 h-4 mr-2" />
                          Notifications
                        </Button>
                        <Button variant="ghost" className="text-white hover:bg-white/10 justify-start">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Button>
                      </div>
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
