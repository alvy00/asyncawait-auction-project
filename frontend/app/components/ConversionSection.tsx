"use client";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Users, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../../components/ui/button";

const BENEFITS = [
  {
    icon: <ShieldCheck className="w-7 h-7 text-green-400" />,
    title: "100% Buyer Protection",
    desc: "Your payments are safe until you receive your item as described."
  },
  {
    icon: <Users className="w-7 h-7 text-blue-400" />,
    title: "10,000+ Happy Members",
    desc: "Join a thriving community of trusted buyers and sellers."
  },
  {
    icon: <ShoppingCart className="w-7 h-7 text-orange-400" />,
    title: "Exclusive Deals",
    desc: "Access rare items and flash sales you won't find anywhere else."
  },
  {
    icon: <Zap className="w-7 h-7 text-pink-400" />,
    title: "Lightning-Fast Auctions",
    desc: "Bid, win, and get your items delivered quickly and securely."
  },
];

export function ConversionSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#18181b] via-[#23272f] to-[#0f172a]">
      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
        {/* Left: Headline, subheadline, benefits, CTA */}
        <div className="flex-1 flex flex-col items-start justify-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-pink-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Unlock the Future of Auctions
          </motion.h2>
          <motion.p
            className="text-lg md:text-2xl text-white/90 mb-8 max-w-xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Experience seamless, secure, and rewarding buying & selling. Join AsyncAwait Auction and discover a smarter way to win.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 w-full max-w-xl">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 * i }}
              >
                <div>{b.icon}</div>
                <div>
                  <div className="text-lg font-semibold text-white mb-1">{b.title}</div>
                  <div className="text-white/80 text-base leading-tight">{b.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <Link href="/signup">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 flex items-center gap-2">
              Get Started Now <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        {/* Right: Illustration or mockup */}
        <motion.div
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Placeholder SVG illustration */}
          <svg width="340" height="340" viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[260px] md:w-[340px] h-auto drop-shadow-2xl">
            <circle cx="170" cy="170" r="170" fill="url(#paint0_radial)" fillOpacity="0.15" />
            <rect x="70" y="110" width="200" height="120" rx="32" fill="url(#paint1_linear)" />
            <rect x="110" y="140" width="120" height="60" rx="16" fill="#fff" fillOpacity="0.08" />
            <rect x="130" y="160" width="80" height="20" rx="8" fill="#fff" fillOpacity="0.18" />
            <defs>
              <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(170 170) scale(170)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f59e42" />
                <stop offset="0.5" stopColor="#a21caf" />
                <stop offset="1" stopColor="#2563eb" />
              </radialGradient>
              <linearGradient id="paint1_linear" x1="70" y1="110" x2="270" y2="230" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f59e42" stopOpacity="0.25" />
                <stop offset="1" stopColor="#2563eb" stopOpacity="0.18" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
      {/* Animated blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-500/20 rounded-full filter blur-[120px] animate-pulse-slow z-0" />
      <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] bg-purple-500/10 rounded-full filter blur-[80px] animate-float z-0" />
      <div className="absolute top-[30%] left-[10%] w-[200px] h-[200px] bg-blue-500/10 rounded-full filter blur-[60px] animate-float-delayed z-0" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0" />
    </section>
  );
} 