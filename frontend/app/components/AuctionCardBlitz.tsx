import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaBolt, FaHourglassHalf, FaStopwatch } from "react-icons/fa";
import { Auction } from "../../lib/interfaces";
import Image from "next/image";

interface AuctionCardProps {
  auction: Auction;
  onBid: () => void;
}

const AuctionCardBlitz: React.FC<AuctionCardProps> = ({ auction, onBid }) => {
  const controls = useAnimation();
  const [isBidding, setIsBidding] = useState(false);
  const [shake, setShake] = useState(false);
  const FALLBACK_IMAGE = "/fallback.jpg";

  useEffect(() => {
    if (auction.status === "live") {
      controls.start({
        scale: [1, 1.05, 1], // very subtle scale pulse
        opacity: [1, 0.75, 1],
        boxShadow: [
          "0 0 4px 1px rgba(255,69,0,0.4)",   // very soft glow
          "0 0 6px 2px rgba(255,140,0,0.5)",
          "0 0 4px 1px rgba(255,69,0,0.4)",
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
        bgClasses = "bg-gradient-to-r from-red-600 to-red-500";
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
        {Icon && <Icon className="text-white" />} {/* removed animate-pulse */}
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
        boxShadow: "0 0 20px 5px rgba(255, 140, 0, 0.7)",
        transition: { duration: 0.3 },
      }}
      className={`relative w-full h-[500px] group rounded-lg overflow-hidden cursor-pointer bg-gray-900 text-white select-none ${
        shake ? "animate-shake" : ""
      }`}
    >
      {/* Auction Image */}
      <Image
        src={FALLBACK_IMAGE}
        alt={auction.item_name}
        width={700} // adjust as needed
        height={288} // adjust as needed
        className="brightness-90 group-hover:brightness-110 transition duration-300 object-cover rounded-t-lg"
      />

      {/* Status Badge */}
      <StatusBadge status={auction.status} />

      {/* Auction Info */}
      <div className="p-5 flex flex-col justify-between h-[calc(100%-288px)] bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-2xl font-bold">{auction.item_name}</h3>
        <p className="mt-2 text-lg">
          Current Bid:{" "}
          <span className="font-extrabold text-orange-400">
            ${auction.highest_bid.toFixed(2)}
          </span>
        </p>
      </div>

      {/* Bid Now Button */}
      {auction.status === "live" && !isBidding && (
  <motion.button
    onClick={handleBidNow}
    whileHover={{
      scale: 1.1,
      boxShadow: "0 0 8px 2px rgba(255, 165, 0, 0.8)",
    }}
    animate={{
      boxShadow: [
        "0 0 10px 3px rgba(255,165,0,0.9)",
        "0 0 15px 5px rgba(255,140,0,1)",
        "0 0 10px 3px rgba(255,165,0,0.9)",
      ],
    }}
    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    className="absolute bottom-5 right-5 px-6 py-2 rounded-md border border-orange-500 bg-orange-600 font-bold text-white backdrop-blur-sm transition-all duration-300 ease-in-out z-10"
  >
    Bid Now
  </motion.button>
)}


      {/* Overlay while bidding */}
      {isBidding && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-xl font-bold text-white z-20 pointer-events-none">
          Placing Your Bid...
        </div>
      )}

      {/* Styles for shake animation */}
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
