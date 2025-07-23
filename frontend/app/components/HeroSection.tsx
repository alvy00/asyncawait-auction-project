/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Auction } from "../../lib/interfaces";
import { ChevronLeft, ChevronRight, Clock, Zap } from "lucide-react";

// Your AuctionCard component remains the same
const AuctionCard = ({ auction, isActive }: { auction: Auction; isActive: boolean }) => {
  return (
    <div className="relative h-full w-full rounded-[2.5rem] p-[2px] overflow-hidden">
      <div
        className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-orange-500/80 via-purple-600/50 to-blue-500/80 transition-opacity duration-500 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className="relative h-full w-full rounded-[calc(2.5rem-2px)] bg-black/70 shadow-[0_12px_48px_0_rgba(255,140,0,0.10),0_8px_32px_0_rgba(31,38,135,0.25)] border border-white/10 overflow-hidden"
        style={{ backdropFilter: "blur(24px)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-80 pointer-events-none rounded-[calc(2.5rem-2px)]" />

        <div className="relative z-10 flex flex-col h-full px-5 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5">
          <div className="flex-shrink-0">
            <h3 className="text-white text-base sm:text-lg font-bold tracking-tight line-clamp-1">{auction.item_name}</h3>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="bg-orange-500/80 text-white text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold uppercase">{auction.auction_type}</span>
              <span className="bg-blue-500/70 text-white text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold uppercase">{auction.category}</span>
              <span
                className={`text-white text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                  auction.condition === "new" ? "bg-green-600/80" : "bg-gray-500/80"
                }`}
              >
                {auction.condition}
              </span>
            </div>
          </div>

          <div className="relative flex-grow flex items-center justify-center w-full my-3">
            {auction.images?.[0] ? (
              <>
                <div
                  className={`absolute inset-4 rounded-2xl bg-gradient-to-br from-orange-500/50 via-purple-700/30 to-blue-600/30 blur-3xl transition-opacity duration-500 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                <Image
                  src={auction.images[0]}
                  alt={auction.item_name}
                  fill
                  className="object-contain rounded-2xl shadow-xl p-4"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  priority={isActive}
                />
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-800/60 rounded-2xl border-2 border-dashed border-white/10">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-200 text-xs sm:text-sm font-semibold mb-3">
              <div className="text-left">
                <span className="text-gray-400 block text-xs">Starting Bid</span>
                <span className="text-orange-300 font-bold text-sm sm:text-base">${auction.starting_price}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 block text-xs">Highest Bid</span>
                <span className="text-green-400 font-bold text-sm sm:text-base">${auction.highest_bid}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <Clock size={14} /> {auction.participants} participants
              </div>
              <div className="flex items-center justify-end gap-1.5 text-gray-400 text-xs">
                <Zap size={14} /> {auction.total_bids} bids
              </div>
            </div>

            <div className="flex justify-center mt-2">
              <Button
                size="lg"
                className="w-full rounded-full px-6 py-3 text-sm sm:text-base font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                {auction.status === "live"
                  ? "Place a Bid"
                  : auction.status === "upcoming"
                  ? "Get Notified"
                  : "View Auction"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// AuctionCardDeck component remains the same as you provided before

function AuctionCardDeck({ auctions }: { auctions: Auction[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardCount = auctions.length;

  function getCardProps(idx: number) {
    const pos = ((idx - activeIndex + cardCount) % cardCount);
    let rel = pos;
    if (rel > Math.floor(cardCount / 2)) rel -= cardCount;

    const isDesktop = typeof window !== "undefined" ? window.innerWidth >= 768 : false;
    const spacing = isDesktop ? 200 : 100;

    if (Math.abs(rel) > 2) {
      return { opacity: 0, scale: 0, x: 0, rotateY: 0, zIndex: 0, filter: "blur(10px)" };
    }

    let x = 0,
      scale = 1,
      zIndex = 10,
      rotateY = 0,
      opacity = 1,
      filter = "";

    if (rel === 0) {
      x = 0;
      scale = 1;
      zIndex = 30;
      rotateY = 0;
      opacity = 1;
      filter = "none";
    } else {
      x = rel * spacing;
      scale = 0.9 - Math.abs(rel) * 0.08;
      zIndex = 20 - Math.abs(rel) * 5;
      rotateY = rel * -35;
      opacity = Math.max(1 - Math.abs(rel) * 0.4, 0);

      const blurAmount = Math.min(Math.abs(rel) * 3, 8);
      const grayAmount = Math.min(Math.abs(rel) * 30, 90);
      const brightness = 100 - Math.abs(rel) * 25;
      filter = `blur(${blurAmount}px) grayscale(${grayAmount}%) brightness(${brightness}%)`;
    }

    return { x, scale, zIndex, rotateY, opacity, filter };
  }

  function handlePrev() {
    setActiveIndex((i) => (i - 1 + cardCount) % cardCount);
  }
  function handleNext() {
    setActiveIndex((i) => (i + 1) % cardCount);
  }

  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const handleDragStart = (e: React.PointerEvent) => {
    setDragStartX(e.clientX);
  };
  const handleDragMove = (e: React.PointerEvent) => {
    if (dragStartX === null) return;
    const dragDelta = e.clientX - dragStartX;
    if (Math.abs(dragDelta) > 50) {
      if (dragDelta > 50) handlePrev();
      else handleNext();
      setDragStartX(null);
    }
  };
  const handleDragEnd = () => {
    setDragStartX(null);
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      <div
        className="relative w-full max-w-[300px] h-[480px] sm:max-w-[360px] sm:h-[580px] md:max-w-[400px] md:h-[640px] flex items-center justify-center select-none"
        style={{ perspective: "2000px" }}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerLeave={handleDragEnd}
      >
        <AnimatePresence initial={false}>
          {auctions.map((auction, idx) => {
            const { x, scale, zIndex, rotateY, opacity, filter } = getCardProps(idx);
            if (opacity === 0) return null;
            return (
              <motion.div
                key={auction.auction_id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ x, scale, zIndex, rotateY, opacity, filter }}
                exit={{ opacity: 0, scale: 0.8, zIndex: zIndex - 2 }}
                transition={{ type: "spring", stiffness: 220, damping: 35 }}
                className={`absolute w-full h-full cursor-grab active:cursor-grabbing`}
                style={{ zIndex, transformStyle: "preserve-3d" }}
              >
                <AuctionCard auction={auction} isActive={idx === activeIndex} />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {cardCount > 1 && (
          <>
            <button
              className="absolute left-[-40px] md:left-[-60px] top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-2 rounded-full z-40 border border-white/20 hover:bg-white/20 hover:scale-110 transition-all cursor-pointer"
              onClick={handlePrev}
              aria-label="Previous card"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-[-40px] md:right-[-60px] top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-2 rounded-full z-40 border border-white/20 hover:bg-white/20 hover:scale-110 transition-all cursor-pointer"
              onClick={handleNext}
              aria-label="Next card"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {auctions.map((_, idx) => (
          <button
            key={idx}
            className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
              idx === activeIndex ? "w-8 bg-gradient-to-r from-orange-500 to-orange-600" : "w-2 bg-white/20 hover:bg-white/40"
            }`}
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
  const [headingDone, setHeadingDone] = useState(false);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("https://asyncawait-auction-project.onrender.com/api/auctions/featured");
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setFeaturedAuctions(data);
        }
      } catch (error) {
        console.error("Failed to fetch featured auctions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const words = [
    { text: "Bid.", style: "" },
    { text: "Win.", style: "" },
    { text: "Collect.", style: "text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600" },
  ];

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 sm:pt-24 md:pt-28 bg-[#19181c]">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-orange-500/30 rounded-full blur-[120px] animate-float" />
        <div className="absolute top-[-8%] right-[-8%] w-[220px] h-[220px] md:w-[320px] md:h-[320px] bg-purple-700/25 rounded-full blur-[100px] animate-float-delayed" />
        <div className="absolute bottom-[-10%] left-[5%] w-[180px] h-[180px] md:w-[260px] md:h-[260px] bg-blue-500/20 rounded-full blur-[80px] animate-float" />
        <div className="absolute bottom-[-8%] right-[10%] w-[140px] h-[140px] md:w-[200px] md:h-[200px] bg-teal-400/20 rounded-full blur-[60px] animate-float-delayed" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center px-6 md:px-10 pt-0">
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onAnimationComplete={() => setHeadingDone(true)}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-center mb-1 tracking-tight leading-tight flex justify-center gap-2"
        >
          {words.map(({ text, style }, idx) => (
            <motion.span key={idx} variants={wordVariants} className={style}>
              {text}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={headingDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="text-sm sm:text-lg md:text-xl text-gray-400 text-center max-w-2xl mx-auto mb-6"
        >
          Join the next generation auction platform—discover rare finds, place real-time bids, and win exclusive items from anywhere.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headingDone ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          className="w-full flex flex-col items-center overflow-visible"
        >
          {loading ? (
            <div className="w-full max-w-[300px] h-[480px] sm:max-w-[360px] sm:h-[580px] md:max-w-[400px] md:h-[640px] flex items-center justify-center bg-white/5 rounded-[2.5rem] animate-pulse border border-white/10 shadow-2xl" />
          ) : featuredAuctions.length > 0 ? (
            <AuctionCardDeck auctions={featuredAuctions} />
          ) : (
            <div className="text-white/80 text-center py-8">No featured auctions available at the moment.</div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
