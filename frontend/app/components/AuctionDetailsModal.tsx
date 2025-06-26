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
import { Tooltip } from "../../components/ui/tooltip";

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
  const [zoomed, setZoomed] = useState(false);

  if (!auction) return null;

  const images = auction.images || [];

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const topBidders = auction.top_bidders || [];

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent
          className="
            max-w-4xl max-h-[90vh] p-6
            overflow-y-auto
            bg-white/5 backdrop-blur-xxl
            border border-white/30
            rounded-sm
            text-white font-mono
            shadow-lg flex flex-col items-center
            custom-scrollbar
          "
          style={{ scrollbarGutter: "stable" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full flex flex-col items-center"
          >
            <DialogHeader className="w-full">
              <DialogTitle></DialogTitle>
              <motion.h2
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                className="
                  text-center
                  text-4xl
                  font-extrabold
                  tracking-wide
                  bg-gradient-to-r
                  from-cyan-400
                  via-blue-400
                  to-purple-500
                  bg-clip-text
                  text-transparent
                  drop-shadow-md
                  my-3
                  mb-5
                  select-none
                  cursor-default
                  hover:scale-105
                  transition-transform
                  duration-300
                  overflow-hidden
                "
              >
                -- {auction.item_name} --
              </motion.h2>
            </DialogHeader>

            {/* Image Section */}
            <div
              className="
                relative w-full max-w-3xl h-[400px]
                rounded-xl overflow-hidden
                border border-white/30
                bg-white/20 backdrop-blur-md
                shadow-inner
                group cursor-pointer
                mb-8
              "
              onClick={() => setZoomed(!zoomed)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`absolute inset-0 transition-transform duration-300 rounded-xl
                    ${zoomed ? "scale-110 cursor-zoom-out" : "cursor-zoom-in"}
                  `}
                >
                  <Image
                    src={images[currentImageIndex] || "/placeholder.jpg"}
                    alt="Auction Image"
                    layout="fill"
                    objectFit="cover"
                    className="brightness-85 rounded-xl hover:brightness-100"
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="
                      absolute left-3 top-1/2 -translate-y-1/2
                      bg-white/20 backdrop-blur-md
                      p-3 rounded-full
                      text-white/90
                      hover:bg-white/30 hover:text-white
                      shadow-md
                      transition
                    "
                    aria-label="Previous image"
                  >
                    <FaArrowLeft />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="
                      absolute right-3 top-1/2 -translate-y-1/2
                      bg-white/20 backdrop-blur-md
                      p-3 rounded-full
                      text-white/90
                      hover:bg-white/30 hover:text-white
                      shadow-md
                      transition
                    "
                    aria-label="Next image"
                  >
                    <FaArrowRight />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(i);
                    }}
                    className={`
                      w-5 h-5 rounded-full border border-white/40 transition-all
                      ${
                        i === currentImageIndex
                          ? "bg-white scale-125 shadow-lg"
                          : "bg-white/30 hover:bg-white/50"
                      }
                    `}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="w-full max-w-3xl flex flex-col items-center gap-6 cursor-default">
              <InfoCard
                label="Description"
                value={
                  <div
                    className="
                      max-h-40 overflow-y-auto pr-2
                      custom-scrollbar
                      rounded-md
                      cursor-default
                    "
                    style={{ scrollbarGutter: "stable" }}
                  >
                    {auction.description}
                  </div>
                }
              />
              <div className="grid grid-cols-2 gap-6 text-sm cursor-default w-full max-w-xl">
                <InfoCard icon={<FaTag />} label="Category" value={auction.category} />
                <InfoCard icon={<FaBoxes />} label="Condition" value={auction.condition} />
                <InfoCard icon={<FaDollarSign />} label="Start Price" value={`$${auction.starting_price.toFixed(2)}`} />
                <InfoCard
                  icon={<FaGavel />}
                  label="Current Bid"
                  value={
                    auction.highest_bid ? (
                      <span className="text-green-400 font-semibold drop-shadow">
                        ${auction.highest_bid.toFixed(2)}
                      </span>
                    ) : (
                      "N/A"
                    )
                  }
                />
                <InfoCard icon={<FaCalendarAlt />} label="Start" value={new Date(auction?.start_time).toLocaleString()} />
                <InfoCard icon={<FaCalendarAlt />} label="End" value={new Date(auction?.end_time).toLocaleString()} />
                <InfoCard icon={<FaRegClock />} label="Time Left" value={<Countdown endTime={auction?.end_time} />} />
                <InfoCard icon={<FaGavel />} label="Auction Type" value={auction?.auction_type?.toUpperCase() || "Standard"} />
              </div>
            </div>

            {/* Top Bidders */}
            <div className="mt-10 w-full max-w-3xl">
              <h4 className="text-white/90 font-semibold text-lg mb-5 tracking-wide drop-shadow-sm text-center">
                Top Bidders
              </h4>
              <div className="flex gap-8 justify-center flex-wrap">
                {topBidders.map((bidder, i) => (
                  <Tooltip key={i} content={`$${bidder.amount.toFixed(2)}`}>
                    <div className="flex flex-col items-center gap-2 cursor-pointer select-none">
                      <Avatar className="ring-2 ring-white/40 hover:ring-white transition-shadow">
                        <AvatarImage src={bidder.avatar} alt={bidder.name} />
                        <AvatarFallback>{bidder.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-white/80 font-semibold drop-shadow-sm">
                        {bidder.name}
                      </span>
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>

          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Scrollbar styling */}
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin; /* Firefox */
          scrollbar-color: rgba(255, 255, 255, 0.4) transparent;
          scrollbar-gutter: stable;
          overflow-y: auto;
          padding-right: 10px; /* Optional, can adjust/remove */
        }

        /* WebKit-based browsers */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          background: transparent; /* overlay, no track background */
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
      `}</style>
    </>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div
      className="
        flex items-center gap-3
        px-5 py-4
        rounded-xl
        bg-white/30 backdrop-blur-md
        border border-white/50
        shadow-lg
        transition
        hover:bg-white/40
        hover:shadow-xl
        text-center
        justify-center
      "
    >
      <div className="text-white/90 text-lg">{icon}</div>
      <div>
        <div className="text-sm text-white font-semibold tracking-wide">{label}</div>
        <div className="text-sm text-white font-mono">{value}</div>
      </div>
    </div>
  );
}
