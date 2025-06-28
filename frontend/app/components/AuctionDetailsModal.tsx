"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Auction } from "../../lib/interfaces";
import Image from "next/image";
import {
  FaTag,
  FaBoxes,
  FaDollarSign,
  FaGavel,
  FaCalendarAlt,
  FaRegClock,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "../../components/ui/tooltip";

interface AuctionDetailsModalProps {
  open: boolean;
  onClose: () => void;
  auction: Auction | null;
}

const Countdown = ({ endTime }: { endTime: string }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const distance = new Date(endTime).getTime() - Date.now();
      if (distance <= 0) {
        setTimeLeft("Ended");
        clearInterval(interval);
        return;
      }
      const h = Math.floor(distance / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <span className="text-white font-mono font-semibold text-md">{timeLeft}</span>
  );
};

export default function AuctionDetailsModal({
  open,
  onClose,
  auction,
}: AuctionDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  if (!auction) return null;
  const images = auction.images || [];
  const topBidders = auction.top_bidders || [];

  const details = [
    { icon: <FaTag />, label: 'Category', value: auction.category },
    { icon: <FaBoxes />, label: 'Condition', value: auction.condition },
    { icon: <FaDollarSign />, label: 'Start', value: `$${auction.starting_price.toFixed(2)}` },
  ];

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="max-w-xl w-full max-h-[90vh] p-0 bg-transparent border-none shadow-none flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full flex flex-col items-center"
        >
          {/* Hero Image with overlayed name and badge */}
          <div className="relative w-full aspect-[16/7] bg-black/30 rounded-t-3xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[currentImageIndex] || "/fallback.jpg"}
                  alt="Auction Image"
                  fill
                  className="object-cover w-full h-full rounded-t-3xl"
                  sizes="(max-width: 768px) 100vw, 900px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-purple-900/20 to-transparent" />
              </motion.div>
            </AnimatePresence>
            {/* Overlayed name and badge (top left) */}
            <div className="absolute top-0 left-0 p-6 flex flex-col gap-2 z-10">
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.45)' }}>{auction.item_name}</h2>
              <span className="inline-block text-xs md:text-base font-semibold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-white px-4 py-1 rounded-full shadow-md border border-white/30 ring-2 ring-blue-400/30 animate-pulse w-fit">
                {auction.auction_type?.toUpperCase() || "STANDARD"}
              </span>
            </div>
            {/* Image navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur p-2 rounded-full text-white/90 hover:bg-white/40 shadow-md transition"
                  aria-label="Previous image"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); setCurrentImageIndex((currentImageIndex + 1) % images.length); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur p-2 rounded-full text-white/90 hover:bg-white/40 shadow-md transition"
                  aria-label="Next image"
                >
                  <FaArrowRight />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={e => { e.stopPropagation(); setCurrentImageIndex(i); }}
                      className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border border-white/40 transition-all ${i === currentImageIndex ? "bg-white scale-125 shadow-lg" : "bg-white/30 hover:bg-white/60"}`}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {/* Details Section below image, compact and scrollable if needed */}
          <div className="w-full bg-white/20 backdrop-blur-2xl px-6 md:px-10 py-6 md:py-8 flex flex-col gap-5 md:gap-7 text-white rounded-b-3xl max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Current Bid - emphasized and moved up */}
            <div className="flex flex-col items-center justify-center mb-2">
              <span className="text-lg font-semibold text-white/80">Current Bid</span>
              <span className="text-3xl md:text-4xl font-extrabold text-green-400 drop-shadow-sm mt-1 flex items-center gap-2">
                <FaGavel className="inline-block text-green-300" />
                {auction.highest_bid ? `$${auction.highest_bid.toFixed(2)}` : 'No Bids'}
              </span>
            </div>
            {/* Description */}
            <div className="text-base md:text-lg font-medium leading-relaxed tracking-wide text-white/95 mb-2 text-center">
              {auction.description}
            </div>
            <div className="w-full h-px bg-white/15 mb-2" />
            {/* Meta Info Row */}
            <div className="flex flex-row flex-wrap items-center justify-center gap-x-6 gap-y-3 w-full mb-2">
              {details.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl">{d.icon}</span>
                  <span className="text-sm md:text-base font-medium text-white/80">{d.value}</span>
                  {i < details.length - 1 && <span className="h-6 w-px bg-white/20 mx-3 hidden sm:inline-block" />}
                </div>
              ))}
            </div>
            <div className="w-full h-px bg-white/10 mb-2" />
            {/* Dates Row: Only Start and End */}
            <div className="flex flex-row flex-wrap items-center justify-center gap-x-8 gap-y-2 w-full mb-2">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-lg md:text-xl" />
                <span className="font-semibold text-white/80">Starts:</span>
                <span className="text-white/80">{new Date(auction.start_time).toLocaleString()}</span>
              </div>
              <span className="h-6 w-px bg-white/20 mx-3 hidden sm:inline-block" />
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-lg md:text-xl" />
                <span className="font-semibold text-white/80">Ends:</span>
                <span className="text-white/80">{new Date(auction.end_time).toLocaleString()}</span>
              </div>
            </div>
            <div className="w-full h-px bg-white/15 mb-2" />
            {/* Top Bidders Row */}
            <div className="w-full mt-2 md:mt-4 px-0 md:px-0 relative">
              <h4 className="text-white/90 font-semibold text-lg md:text-xl mb-3 tracking-wide drop-shadow-sm text-center">
                Top Bidders
              </h4>
              {topBidders.length === 0 ? (
                <div className="text-center text-white/60 italic py-6">No bidders yet.</div>
              ) : (
                <div className="flex gap-6 overflow-x-auto pb-2 justify-center custom-scrollbar">
                  {topBidders.map((bidder, i) => (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center gap-2 cursor-pointer select-none min-w-[64px]">
                          <Avatar className="ring-2 ring-white/60 hover:ring-blue-400 transition-shadow w-16 h-16 md:w-20 md:h-20 shadow-lg">
                            <AvatarImage src={bidder.avatar} alt={bidder.name} />
                            <AvatarFallback>{bidder.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs md:text-base text-white/90 font-semibold drop-shadow-sm truncate max-w-[70px] text-center">{bidder.name}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs font-mono animate-fade-in">
                        ${bidder.amount.toFixed(2)}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
        {/* Custom Scrollbar Styling */}
        <style>{`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.4) transparent;
            scrollbar-gutter: stable;
            overflow-y: auto;
            padding-right: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar {
            height: 8px;
            width: 8px;
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 9999px;
            transition: background-color 0.3s;
          }
          .custom-scrollbar:hover::-webkit-scrollbar-thumb,
          .custom-scrollbar:active::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.6);
          }
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.25s ease;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}

function TimelineItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="text-lg md:text-xl">{icon}</span>
      <span className="font-semibold text-white/80">{label}:</span>
      <span>{value}</span>
    </span>
  );
}

function TimelineConnector() {
  return <span className="mx-2 text-white/40 text-2xl">•</span>;
}
