/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Auction } from "../../lib/interfaces";

function maskCardNumber(cardNumber: string) {
  return cardNumber.replace(/\w{4}(?=\w{4})/g, "**** ");
}

function StatusBadge({ status }: { status: string }) {
  if (status === "live") return <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold ml-2">LIVE</span>;
  if (status === "ended") return <span className="bg-gray-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold ml-2">ENDED</span>;
  return null;
}

function AuctionCardDeck({ auctions }: { auctions: Auction[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardCount = auctions.length;

  function getCardProps(idx: number) {
    const pos = ((idx - activeIndex + cardCount) % cardCount);
    let rel = pos;
    if (rel > Math.floor(cardCount / 2)) rel -= cardCount;
    // Responsive spread: wider on desktop
    const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 768 : false;
    let x = 0, scale = 1, z = 10, rotate = 0, opacity = 1, filter = "";
    if (rel === 0) { x = 0; scale = 1; z = 30; rotate = 0; opacity = 1; }
    else if (rel === -1) { x = isDesktop ? -180 : -70; scale = 0.93; z = 20; rotate = isDesktop ? -10 : -8; opacity = 0.85; }
    else if (rel === 1) { x = isDesktop ? 180 : 70; scale = 0.93; z = 20; rotate = isDesktop ? 10 : 8; opacity = 0.85; }
    else if (rel === -2) { x = isDesktop ? -340 : -130; scale = 0.87; z = 10; rotate = isDesktop ? -18 : -16; opacity = 0.65; filter = "blur(2.5px)"; }
    else if (rel === 2) { x = isDesktop ? 340 : 130; scale = 0.87; z = 10; rotate = isDesktop ? 18 : 16; opacity = 0.65; filter = "blur(2.5px)"; }
    else { opacity = 0; z = 0; }
    return { x, scale, zIndex: z, rotate, opacity, filter };
  }

  function handlePrev() {
    setActiveIndex((i) => (i - 1 + cardCount) % cardCount);
  }
  function handleNext() {
    setActiveIndex((i) => (i + 1) % cardCount);
  }

  // Touch/drag support
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);
  function handleTouchStart(e: React.TouchEvent) {
    setDragStartX(e.touches[0].clientX);
  }
  function handleTouchMove(e: React.TouchEvent) {
    if (dragStartX !== null) setDragDelta(e.touches[0].clientX - dragStartX);
  }
  function handleTouchEnd() {
    if (dragDelta > 50) handlePrev();
    else if (dragDelta < -50) handleNext();
    setDragStartX(null);
    setDragDelta(0);
  }

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-72 bg-gradient-to-br from-orange-500/20 to-transparent blur-2xl rounded-full pointer-events-none hidden md:block" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-72 bg-gradient-to-bl from-purple-700/20 to-transparent blur-2xl rounded-full pointer-events-none hidden md:block" />
      <div
        className="relative w-full max-w-[320px] h-[440px] sm:max-w-[360px] sm:h-[500px] md:max-w-[400px] md:h-[560px] flex items-center justify-center select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {auctions.map((auction, idx) => {
            const { x, scale, zIndex, rotate, opacity, filter } = getCardProps(idx);
            if (opacity === 0) return null;
            return (
              <motion.div
                key={auction.auction_id}
                initial={{ x: 0, scale: 0.9, opacity: 0, rotate: 0 }}
                animate={{ x, scale, opacity, zIndex, rotate, filter }}
                exit={{ x: 0, scale: 0.9, opacity: 0, zIndex: 0, rotate: 0, filter: "blur(2.5px)" }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
                className={`absolute w-full h-full top-0 left-0 flex flex-col justify-between pointer-events-${scale === 1 ? "auto" : "none"}`}
                style={{ zIndex }}
              >
                <div className="relative h-full w-full rounded-[2.5rem] bg-black/60 shadow-[0_12px_48px_0_rgba(255,140,0,0.10),0_8px_32px_0_rgba(31,38,135,0.25)] border border-white/10 overflow-hidden" style={{backdropFilter:'blur(16px)'}}>
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#18181b]/80 via-[#23232a]/60 to-transparent opacity-90" />
                  {/* Card content */}
                  <div className="relative z-10 flex flex-col justify-between h-full px-4 sm:px-7 pt-6 sm:pt-7 pb-4 sm:pb-5">
                    {/* Top badges */}
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <span className="text-white text-xs sm:text-sm md:text-base font-semibold tracking-wide line-clamp-1">{auction.item_name}</span>
                      <div className="flex gap-1 flex-wrap">
                        <span className="bg-orange-500/80 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold uppercase">{auction.auction_type}</span>
                        <span className="bg-blue-500/70 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold uppercase">{auction.category}</span>
                        <span className={`text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold uppercase ${auction.condition === 'new' ? 'bg-green-600/80' : 'bg-gray-500/80'}`}>{auction.condition}</span>
                        {auction.buy_now && <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold ml-1">Buy Now ${auction.buy_now}</span>}
                      </div>
                    </div>
                    {/* Product image - large, eye-catching, with glow */}
                    {auction.images?.[0] ? (
                      <div className="relative flex items-center justify-center w-full h-[120px] sm:h-[160px] md:h-[190px] lg:h-[220px] mb-2">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/20 via-purple-700/10 to-blue-600/10 blur-2xl" />
                        <Image
                          src={auction.images[0]}
                          alt={auction.item_name}
                          fill
                          className="object-cover rounded-2xl shadow-xl border-2 border-white/10"
                          sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, (max-width: 1024px) 190px, 220px"
                          priority={scale === 1}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full h-[120px] sm:h-[160px] md:h-[190px] lg:h-[220px] mb-2 bg-gray-800/60 rounded-2xl border-2 border-white/10">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                    {/* Description (2 lines ellipsis) */}
                    <div className="text-gray-300 text-xs sm:text-sm md:text-base text-center mb-1 truncate w-full line-clamp-2 min-h-[2.5em]">{auction.description}</div>
                    {/* Price and stats */}
                    <div className="flex flex-col gap-1 mt-2">
                      <div className="flex items-center justify-between text-gray-200 text-xs sm:text-sm md:text-base font-semibold">
                        <span>Start: <span className="text-orange-300 font-bold">${auction.starting_price}</span></span>
                        <span>Highest: <span className="text-green-400 font-bold">${auction.highest_bid}</span></span>
                      </div>
                      <div className="flex items-center justify-between text-gray-400 text-xs mt-1">
                        <span className="flex items-center gap-1"><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> {auction.participants} participants</span>
                        <span className="flex items-center gap-1"><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 20v-6M6 12l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> {auction.total_bids} bids</span>
                      </div>
                    </div>
                    {/* Floating CTA */}
                    <div className="flex justify-center mt-4">
                      <Button size="sm" className="rounded-full px-6 py-2 text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg transition-all duration-300">
                        {auction.status === "live" ? "Bid Now" : auction.status === "upcoming" ? "Coming Soon" : "View Details"}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {/* Nav arrows */}
        <button
          className="absolute left-[-32px] top-1/2 -translate-y-1/2 bg-gradient-to-br from-orange-500 to-orange-600 text-white p-2 rounded-full z-30 shadow-md border-2 border-white/30 hover:scale-110 transition"
          onClick={handlePrev}
          aria-label="Previous card"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button
          className="absolute right-[-32px] top-1/2 -translate-y-1/2 bg-gradient-to-br from-orange-500 to-orange-600 text-white p-2 rounded-full z-30 shadow-md border-2 border-white/30 hover:scale-110 transition"
          onClick={handleNext}
          aria-label="Next card"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {auctions.map((_, idx) => (
          <button
            key={idx}
            className={`h-2 w-6 rounded-full transition-all duration-300 ${idx === activeIndex ? "bg-gradient-to-r from-orange-500 to-orange-600" : "bg-white/20"}`}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to card ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  const [featuredAuctions, setFeaturedAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("https://asyncawait-auction-project.onrender.com/api/auctions/featured");
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) return;
        setFeaturedAuctions(data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 sm:pt-24 md:pt-28 bg-[#19181c]">
      {/* Subtle, dynamic background shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Vignette/fade on sides */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        {/* Orange blob top left */}
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-orange-500/30 rounded-full blur-[120px] animate-float" />
        {/* Purple blob top right */}
        <div className="absolute top-[-8%] right-[-8%] w-[220px] h-[220px] md:w-[320px] md:h-[320px] bg-purple-700/25 rounded-full blur-[100px] animate-float-delayed" />
        {/* Blue blob bottom left */}
        <div className="absolute bottom-[-10%] left-[5%] w-[180px] h-[180px] md:w-[260px] md:h-[260px] bg-blue-500/20 rounded-full blur-[80px] animate-float" />
        {/* Teal blob bottom right */}
        <div className="absolute bottom-[-8%] right-[10%] w-[140px] h-[140px] md:w-[200px] md:h-[200px] bg-teal-400/20 rounded-full blur-[60px] animate-float-delayed" />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>
      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center px-6 md:px-10 pt-0">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-center mb-1 tracking-tight leading-tight"
        >
          Bid. Win. <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Collect.</span>
        </motion.h1>
        {/* Subheadline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-200 text-center mb-1"
        >
          The Future of Auctions Starts Here.
        </motion.h2>
        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-sm sm:text-lg md:text-xl text-gray-400 text-center max-w-2xl mx-auto mb-6"
        >
          Join the next generation auction platform—discover rare finds, place real-time bids, and win exclusive items from anywhere.
        </motion.p>
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-8"
        >
          <Button size="lg" className="rounded-full px-8 py-3 text-base font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg transition-all duration-300">
            Start today!
          </Button>
        </motion.div>
        {/* Card Deck Carousel */}
        <div className="w-full flex flex-col items-center overflow-visible">
          {loading ? (
            <div className="w-full max-w-[320px] h-[440px] sm:max-w-[360px] sm:h-[500px] md:max-w-[400px] md:h-[560px] lg:max-w-[520px] lg:h-[650px] flex items-center justify-center bg-white/5 rounded-[2.5rem] animate-pulse border border-white/10 shadow-2xl" />
          ) : featuredAuctions.length > 0 ? (
            <div className="w-full flex justify-center">
              <div className="w-full max-w-[320px] h-[440px] sm:max-w-[360px] sm:h-[500px] md:max-w-[400px] md:h-[560px] lg:max-w-[520px] lg:h-[650px]">
                <AuctionCardDeck auctions={featuredAuctions} />
              </div>
            </div>
          ) : (
            <div className="text-white/80 text-center py-8">No featured cards available.</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;