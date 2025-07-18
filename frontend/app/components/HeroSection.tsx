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
                <div className="relative h-full w-full rounded-[2.5rem] bg-black/60 shadow-2xl border border-white/10 overflow-hidden" style={{backdropFilter:'blur(16px)', boxShadow:'0 8px 32px 0 rgba(31,38,135,0.25)'}}>
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#18181b]/80 via-[#23232a]/60 to-transparent opacity-90" />
                  {/* Card content */}
                  <div className="relative z-10 flex flex-col justify-between h-full px-4 sm:px-7 pt-6 sm:pt-7 pb-4 sm:pb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-xs sm:text-sm md:text-base font-semibold tracking-wide">Personal Cards</span>
                      <span className="text-gray-300 text-xs sm:text-sm md:text-base font-bold uppercase">{auction.auction_type?.toUpperCase()}</span>
                    </div>
                    {/* Product image - large, eye-catching, with glow */}
                    {auction.images?.[0] && (
                      <div className="relative flex items-center justify-center w-full h-[120px] sm:h-[160px] md:h-[190px] lg:h-[220px] mb-3">
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
                    )}
                    <div className="flex-1 flex flex-col justify-center items-center">
                      <div className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-center leading-tight mb-1 truncate w-full">
                        {auction.item_name}
                      </div>
                      <div className="text-orange-400 text-lg sm:text-xl md:text-2xl font-extrabold text-center mb-1">
                        {auction.highest_bid ? `$${auction.highest_bid}` : ''}
                      </div>
                      <div className="text-gray-300 text-xs sm:text-sm md:text-base text-center mb-1 truncate w-full">
                        {auction.creator}
                      </div>
                      <StatusBadge status={auction.status} />
                    </div>
                    <div className="flex items-center justify-between text-gray-400 text-[10px] sm:text-xs md:text-sm mt-2">
                      <div>
                        <div>Card No</div>
                        <div className="font-mono text-[11px] sm:text-[12px] md:text-sm">{maskCardNumber(String(auction.auction_id).padStart(4, "0"))}</div>
                      </div>
                      <div className="text-right">
                        <div>Exp Date</div>
                        <div className="font-mono text-[11px] sm:text-[12px] md:text-sm">{auction.end_time ? new Date(auction.end_time).toLocaleDateString() : "--/--"}</div>
                      </div>
                    </div>
                    {/* Floating CTA */}
                    <div className="flex justify-center mt-5">
                      <Button size="sm" className="rounded-full px-6 py-2 text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg transition-all duration-300">
                        {auction.status === "live" ? "Bid Now" : "View Details"}
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
    <section className="relative min-h-screen h-screen flex flex-col items-center justify-center overflow-visible pt-20 sm:pt-24 py-8 md:py-12 bg-[#19181c]">
      {/* Subtle, dynamic background shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
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
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center px-4 pt-24 sm:pt-32 md:pt-36">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-center mb-2 tracking-tight leading-tight"
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
            <div className="w-full max-w-[320px] h-[440px] sm:max-w-[360px] sm:h-[500px] md:max-w-[400px] md:h-[560px] flex items-center justify-center bg-white/5 rounded-[2.5rem] animate-pulse border border-white/10" />
          ) : featuredAuctions.length > 0 ? (
            <AuctionCardDeck auctions={featuredAuctions} />
          ) : (
            <div className="text-white/80 text-center py-8">No featured cards available.</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;