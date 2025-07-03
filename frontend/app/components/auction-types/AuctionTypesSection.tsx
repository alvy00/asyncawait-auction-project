"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { CheckCircle, Zap, Timer, TrendingDown, TrendingUp, Award, Gavel } from "lucide-react";

const AUCTION_TYPES = [
  {
    key: "dutch",
    label: "Dutch Auction",
    icon: (
      <Zap className="w-16 h-16 text-orange-400 drop-shadow-lg" />
    ),
    accent: "from-orange-500/20 via-orange-400/10 to-orange-600/10",
    gradientText: "bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-600 bg-clip-text text-transparent",
    description: (
      <>
        <span className="font-semibold text-orange-400">Dutch Auction</span> starts high and drops the price until someone accepts. <span className="text-orange-300 font-bold">First come, first served</span>—no waiting, no bidding wars.
      </>
    ),
    steps: [
      { icon: <TrendingDown className="w-6 h-6 text-orange-400" />, text: "Auction starts at a high price." },
      { icon: <Timer className="w-6 h-6 text-orange-400" />, text: "Price drops every minute." },
      { icon: <CheckCircle className="w-6 h-6 text-orange-400" />, text: "First to accept wins instantly." },
      { icon: <Award className="w-6 h-6 text-orange-400" />, text: "No further bids after acceptance." },
    ],
    features: [
      { icon: <Zap className="w-5 h-5 text-orange-400" />, label: "Fast Sales" },
      { icon: <Timer className="w-5 h-5 text-orange-400" />, label: "No Sniping" },
      { icon: <Award className="w-5 h-5 text-orange-400" />, label: "Great for Rare Items" },
    ],
    cta: { label: "See Dutch Auctions", href: "/auctions/live?type=dutch" },
    animation: (
      <motion.div
        className="text-4xl font-mono font-bold text-orange-400"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.2, 1], color: ["#f59e42", "#ef4444", "#f59e42"] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        $100 → $40
      </motion.div>
    ),
  },
  {
    key: "reverse",
    label: "Reverse Auction",
    icon: (
      <TrendingDown className="w-16 h-16 text-indigo-400 drop-shadow-lg" />
    ),
    accent: "from-indigo-500/20 via-blue-400/10 to-blue-600/10",
    gradientText: "bg-gradient-to-r from-indigo-400 via-blue-400 to-blue-600 bg-clip-text text-transparent",
    description: (
      <>
        <span className="font-semibold text-indigo-400">Reverse Auction</span> flips the script: sellers compete to offer the lowest price for a buyer's request. <span className="text-indigo-300 font-bold">Best value wins</span>.
      </>
    ),
    steps: [
      { icon: <Award className="w-6 h-6 text-indigo-400" />, text: "Buyer posts a request." },
      { icon: <TrendingDown className="w-6 h-6 text-indigo-400" />, text: "Sellers submit decreasing bids." },
      { icon: <CheckCircle className="w-6 h-6 text-indigo-400" />, text: "Buyer picks the best offer." },
      { icon: <Award className="w-6 h-6 text-indigo-400" />, text: "Lowest price or best value wins." },
    ],
    features: [
      { icon: <TrendingDown className="w-5 h-5 text-indigo-400" />, label: "Competitive" },
      { icon: <Award className="w-5 h-5 text-indigo-400" />, label: "Great for Services" },
      { icon: <Timer className="w-5 h-5 text-indigo-400" />, label: "Transparent" },
    ],
    cta: { label: "See Reverse Auctions", href: "/auctions/live?type=reverse" },
    animation: (
      <motion.div
        className="flex gap-2 items-center text-indigo-400 font-mono text-2xl"
        animate={{ x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="line-through">$100</span>
        <span className="font-bold">$40</span>
      </motion.div>
    ),
  },
  {
    key: "blitz",
    label: "Blitz Auction",
    icon: (
      <Timer className="w-16 h-16 text-pink-400 drop-shadow-lg" />
    ),
    accent: "from-pink-500/20 via-fuchsia-400/10 to-fuchsia-600/10",
    gradientText: "bg-gradient-to-r from-pink-400 via-fuchsia-400 to-fuchsia-600 bg-clip-text text-transparent",
    description: (
      <>
        <span className="font-semibold text-pink-400">Blitz Auction</span> is a high-energy, short-timer event. <span className="text-pink-300 font-bold">Bid fast, win big</span>—last-second bids may extend the timer.
      </>
    ),
    steps: [
      { icon: <Timer className="w-6 h-6 text-pink-400" />, text: "Auction opens for 10–30 minutes only." },
      { icon: <Zap className="w-6 h-6 text-pink-400" />, text: "Bidders place rapid, real-time bids." },
      { icon: <Timer className="w-6 h-6 text-pink-400" />, text: "Last-second bids can extend the timer." },
      { icon: <Award className="w-6 h-6 text-pink-400" />, text: "Highest bid at the buzzer wins." },
    ],
    features: [
      { icon: <Zap className="w-5 h-5 text-pink-400" />, label: "Adrenaline" },
      { icon: <Timer className="w-5 h-5 text-pink-400" />, label: "No Waiting" },
      { icon: <Award className="w-5 h-5 text-pink-400" />, label: "Perfect for Flash Sales" },
    ],
    cta: { label: "See Blitz Auctions", href: "/auctions/live?type=blitz" },
    animation: (
      <motion.div
        className="flex items-center gap-2 text-pink-400 font-mono text-2xl"
        animate={{ scale: [1, 1.15, 1], color: ["#f472b6", "#a21caf", "#f472b6"] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <span>00:10</span>
        <span className="font-bold">$320</span>
      </motion.div>
    ),
  },
  {
    key: "classic",
    label: "Classic Auction",
    icon: (
      <Gavel className="w-16 h-16 text-blue-400 drop-shadow-lg" />
    ),
    accent: "from-blue-500/20 via-blue-400/10 to-blue-600/10",
    gradientText: "bg-gradient-to-r from-blue-400 via-sky-400 to-blue-600 bg-clip-text text-transparent",
    description: (
      <>
        <span className="font-semibold text-blue-400">Classic Auction</span> is the traditional ascending-bid auction. <span className="text-blue-300 font-bold">Highest bid wins</span> when the timer ends. Bidders compete openly, raising the price until no one is willing to bid higher.
      </>
    ),
    steps: [
      { icon: <Gavel className="w-6 h-6 text-blue-400" />, text: "Auction opens at a starting price." },
      { icon: <TrendingUp className="w-6 h-6 text-blue-400" />, text: "Bidders place higher and higher bids." },
      { icon: <Timer className="w-6 h-6 text-blue-400" />, text: "Auction ends at a set time." },
      { icon: <CheckCircle className="w-6 h-6 text-blue-400" />, text: "Highest bid at the end wins." },
    ],
    features: [
      { icon: <TrendingUp className="w-5 h-5 text-blue-400" />, label: "Open Competition" },
      { icon: <Timer className="w-5 h-5 text-blue-400" />, label: "Fair & Transparent" },
      { icon: <Award className="w-5 h-5 text-blue-400" />, label: "Most Popular Format" },
    ],
    cta: { label: "See Classic Auctions", href: "/auctions/live?type=classic" },
    animation: (
      <motion.div
        className="flex gap-2 items-center text-blue-400 font-mono text-2xl"
        animate={{ x: [0, 10, 0], color: ["#60a5fa", "#2563eb", "#60a5fa"] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span>$40</span>
        <TrendingUp className="w-6 h-6" />
        <span className="font-bold">$320</span>
      </motion.div>
    ),
  },
];

export function AuctionTypesSection() {
  const [active, setActive] = useState("dutch");
  const activeType = AUCTION_TYPES.find((t) => t.key === active)!;

  return (
    <section className="py-20 relative overflow-hidden ">
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center text-white mb-12 drop-shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Explore Our Auction Types
        </motion.h2>
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-lg overflow-hidden">
            {AUCTION_TYPES.map((type) => (
              <button
                key={type.key}
                className={`px-6 py-2 md:px-10 md:py-3 font-semibold text-lg transition-all duration-200 focus:outline-none ${
                  active === type.key
                    ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-md"
                    : "text-white/70 hover:text-white"
                }`}
                onClick={() => setActive(type.key)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeType.key}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
              className={`rounded-3xl p-0 md:p-2 shadow-2xl border border-white/10 bg-gradient-to-br ${activeType.accent} backdrop-blur-xl relative overflow-hidden`}
            >
              <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-blue-500/10 opacity-30 pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row gap-0 md:gap-0 items-stretch">
                {/* Left: Icon, animation, feature badges */}
                <div className="flex flex-col items-center justify-center md:w-1/3 bg-white/5 bg-opacity-10 rounded-l-3xl p-8 md:p-12 border-r border-white/10 min-h-[400px]">
                  <div className="mb-4">{activeType.icon}</div>
                  <div className="mb-2">{activeType.animation}</div>
                  <div className="flex flex-col gap-2 mt-6 w-full">
                    {activeType.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl text-white/90 font-medium text-sm shadow-sm">
                        {f.icon}
                        <span>{f.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Right: Content */}
                <div className="flex-1 flex flex-col justify-center p-8 md:p-12">
                  <div className={`text-3xl md:text-4xl font-bold mb-2 ${activeType.gradientText}`}>{activeType.label}</div>
                  <div className="text-lg md:text-xl text-white/90 mb-4 font-medium">{activeType.description}</div>
                  {/* Stepper */}
                  <div className="mb-6">
                    <div className="text-lg font-semibold text-white mb-2">How it works</div>
                    <ol className="space-y-3">
                      {activeType.steps.map((step, i) => (
                        <motion.li
                          key={i}
                          className="flex items-center gap-3 text-white/90"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i, duration: 0.4 }}
                        >
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/20 mr-2">
                            {step.icon}
                          </span>
                          <span className="text-base md:text-lg">{step.text}</span>
                        </motion.li>
                      ))}
                    </ol>
                  </div>
                  <Link href={activeType.cta.href} className="mt-4 inline-block">
                    <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      {activeType.cta.label}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {/* Glassy gradient background blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-500/20 rounded-full filter blur-[120px] animate-pulse-slow z-0" />
      <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] bg-purple-500/10 rounded-full filter blur-[80px] animate-float z-0" />
      <div className="absolute top-[30%] left-[10%] w-[200px] h-[200px] bg-blue-500/10 rounded-full filter blur-[60px] animate-float-delayed z-0" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0" />
    </section>
  );
} 