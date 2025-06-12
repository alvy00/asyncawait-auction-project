import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaArrowDown, FaClock, FaBan } from "react-icons/fa";
import { Auction } from "../../lib/interfaces";
import Image from "next/image";
import { Countdown } from "./Countdown";

interface AuctionCardProps {
  auction: Auction;
  onBid: () => void;
}

const FIREY_PURPLE = "rgba(191, 85, 236, "; // vibrant purple (rgba base)

const AuctionCardReverse: React.FC<AuctionCardProps> = ({ auction, onBid }) => {
  const controls = useAnimation();
  const [isBidding, setIsBidding] = useState(false);
  const [shake, setShake] = useState(false);
  const FALLBACK_IMAGE = "/fallback.jpg";

  useEffect(() => {
    if (auction.status === "live") {
      controls.start({
        scale: [1, 1.1, 1],
        boxShadow: [
          `0 0 8px 2px ${FIREY_PURPLE}0.7)`,
          `0 0 20px 6px ${FIREY_PURPLE}0.95)`,
          `0 0 8px 2px ${FIREY_PURPLE}0.7)`,
        ],
        transition: {
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        },
      });
    } else {
      controls.stop();
      controls.set({ scale: 1, boxShadow: "none" });
    }
  }, [auction.status, controls]);

  useEffect(() => {
    if (isBidding) {
      setShake(true);
      const timer = setTimeout(() => {
        setShake(false);
        setIsBidding(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isBidding]);

  const handleBidNow = () => {
    setIsBidding(true);
    onBid();
  };

  const StatusBadge = ({ status }: { status: string }) => {
    let bgClasses = "";
    let text = "";
    let Icon = null;

    switch (status.toLowerCase()) {
      case "live":
        bgClasses = "bg-gradient-to-r from-purple-700 to-purple-600";
        text = "REVERSE LIVE";
        Icon = FaArrowDown;
        break;
      case "upcoming":
        bgClasses = "bg-gradient-to-r from-yellow-600 to-yellow-500";
        text = "REVERSE UPCOMING";
        Icon = FaClock;
        break;
      case "ended":
        bgClasses = "bg-gradient-to-r from-gray-700 to-gray-600";
        text = "REVERSE ENDED";
        Icon = FaBan;
        break;
      default:
        return null;
    }

    return (
      <motion.div
        animate={status.toLowerCase() === "live" ? controls : { scale: 1 }}
        className={`${bgClasses} text-white text-xs font-bold px-4 py-1 z-10 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm absolute top-4 left-4`}
      >
        {Icon && <Icon className="text-white animate-pulse" />}
        <span>{text}</span>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.03,
        boxShadow: `0 0 30px 10px ${FIREY_PURPLE}0.7)`,
        transition: { duration: 0.3 },
      }}
      className={`relative w-full h-[500px] group rounded-lg overflow-hidden bg-gradient-to-br from-purple-900 to-purple-800 text-white border border-white/20 select-none flex flex-col ${
        shake ? "animate-shake" : ""
      }`}
    >
      {/* Image container with fixed height */}
      <div className="relative h-72 w-full rounded-t-lg overflow-hidden">
        <Image
          src={FALLBACK_IMAGE}
          alt={auction.item_name || "Reverse Auction"}
          fill
          sizes="(max-width: 768px) 100vw, 700px"
          className="brightness-90 group-hover:brightness-110 transition duration-300 object-cover"
          priority
        />
      </div>

      <StatusBadge status={auction.status} />

      {/* Info section fills remaining space */}
      <div className="p-5 flex flex-col justify-between flex-grow bg-gradient-to-t from-black/80 to-transparent relative">
        <div>
          <h3 className="text-2xl font-bold">{auction.item_name}</h3>
          <p className="mt-2 text-lg">
            Lowest Bid:{" "}
            <span className="font-extrabold text-purple-300">
              ${auction.starting_price?.toFixed(2) ?? "—"}
            </span>
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-orange-400">
            <span className="text-white bg-white/5 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10 font-mono tracking-wide">
              <Countdown endTime={auction.end_time} />
            </span>
          </div>
        </div>

        {auction.status === "live" && !isBidding && (
          <div className="mt-5 flex justify-end">
            <motion.button
              onClick={handleBidNow}
              className="px-6 py-3 rounded-md border border-purple-500 bg-purple-700 font-bold text-white backdrop-blur-sm transition-all duration-300 ease-in-out cursor-pointer"
              type="button"
            >
              Place Lower Bid
            </motion.button>
          </div>
        )}
      </div>

      {/* Overlay during bidding */}
      {isBidding && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xl font-bold text-white z-50 pointer-events-auto space-x-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-10 h-10 border-4 border-white border-t-transparent rounded-full"
          />
          <span>Submitting Bid...</span>
        </div>
      )}

      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.6s ease-in-out;
          }
        `}
      </style>
    </motion.div>
  );
};

export default AuctionCardReverse;
