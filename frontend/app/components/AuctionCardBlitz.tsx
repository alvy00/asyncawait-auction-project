import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaBolt, FaHourglassHalf, FaStopwatch } from "react-icons/fa";
import { Auction } from "../../lib/interfaces";
import Image from "next/image";
import { Countdown } from "./Countdown";

interface AuctionCardProps {
  auction: Auction;
  onBid: () => void;
}

const FIREY_ORANGE = "#FF4500"; // Firey Orange (OrangeRed)

const AuctionCardBlitz: React.FC<AuctionCardProps> = ({ auction, onBid }) => {
  const controls = useAnimation();
  const [isBidding, setIsBidding] = useState(false);
  const [shake, setShake] = useState(false);
  const FALLBACK_IMAGE = "/fallback.jpg";

  useEffect(() => {
    if (auction.status === "live") {
      controls.start({
        scale: [1, 1.05, 1],
        opacity: [1, 0.75, 1],
        boxShadow: [
          `0 0 5px 1px ${FIREY_ORANGE}80`,
          `0 0 8px 3px ${FIREY_ORANGE}B3`,
          `0 0 5px 1px ${FIREY_ORANGE}80`,
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

  // Status Badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let bgClasses = "";
    let text = "";
    let Icon = null;

    switch (status.toLowerCase()) {
      case "live":
        bgClasses = "bg-gradient-to-r from-orange-800 to-orange-600";
        text = "BLITZ LIVE";
        Icon = FaBolt;
        break;
      case "upcoming":
        bgClasses = "bg-gradient-to-r from-yellow-500 to-yellow-400";
        text = "BLITZ UPCOMING";
        Icon = FaHourglassHalf;
        break;
      case "ended":
        bgClasses = "bg-gradient-to-r from-gray-700 to-gray-600";
        text = "BLITZ ENDED";
        Icon = FaStopwatch;
        break;
      default:
        return null;
    }

    return (
      <motion.div
        animate={status.toLowerCase() === "live" ? controls : { scale: 1, boxShadow: "none" }}
        className={`${bgClasses} text-white text-xs font-bold px-4 py-1 z-10 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm absolute top-4 left-4`}
      >
        {Icon && <Icon className="text-white" />}
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
        boxShadow: `0 0 20px 5px ${FIREY_ORANGE}B3`,
        transition: { duration: 0.3 },
      }}
      className={`relative w-full h-[550px] group rounded-lg overflow-hidden bg-gray-900 border border-white/20 text-white select-none ${
        shake ? "animate-shake" : ""
      }`}
    >
      {/* Image container */}
      <div className="relative h-[300px] w-full">
        <Image
          src={FALLBACK_IMAGE}
          alt={auction.item_name}
          fill
          style={{ objectFit: "cover" }}
          className="brightness-90 group-hover:brightness-110 transition duration-300 rounded-t-lg"
          priority
        />
      </div>

      {/* Status Badge */}
      <StatusBadge status={auction.status} />

      {/* Content area */}
      <div className="p-5 flex flex-col justify-between h-[calc(100%-300px)] bg-gradient-to-t from-black/80 to-transparent">
        <div>
          <h3 className="text-2xl font-bold">{auction.item_name}</h3>
          <div className="mt-2 text-lg">
            Current Bid:{" "}
            <span className="font-extrabold" style={{ color: FIREY_ORANGE }}>
              ${auction.highest_bid.toFixed(2)}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-orange-400">
            <span className="text-white bg-white/5 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10 font-mono tracking-wide">
              <Countdown endTime={auction.end_time} />
            </span>
          </div>
        </div>

        {/* Bid Now Button */}
        {auction.status === "live" && !isBidding && (
          <div className="absolute bottom-5 right-5 z-10">
            <motion.button
              onClick={handleBidNow}
              className="mt-6 self-start px-6 py-2 rounded-md border border-orange-700 bg-orange-800 font-bold text-white backdrop-blur-sm transition-all duration-300 ease-in-out z-10 cursor-pointer"
            >
              Bid Now
            </motion.button>
          </div>
        )}
      </div>

      {/* Overlay while bidding */}
      {isBidding && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-xl font-bold text-white z-20 pointer-events-none">
          Placing Your Bid...
        </div>
      )}

      {/* Shake animation styles */}
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

export default AuctionCardBlitz;
