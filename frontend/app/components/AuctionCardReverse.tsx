import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaArrowDown, FaClock, FaBan } from "react-icons/fa";
import { Auction } from "../../lib/interfaces";
import Image from "next/image";

interface AuctionCardProps {
  auction: Auction;
  onBid: () => void;
}

const AuctionCardReverse: React.FC<AuctionCardProps> = ({ auction, onBid }) => {
  const controls = useAnimation();
  const [isBidding, setIsBidding] = useState(false);
  const [shake, setShake] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const FALLBACK_IMAGE = "/fallback.jpg";

  useEffect(() => {
    const endTimestamp = new Date(auction.end_time).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((endTimestamp - now) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [auction.end_time]);

  useEffect(() => {
    if (auction.status === "live") {
      controls.start({
        scale: [1, 1.1, 1],
        boxShadow: [
          "0 0 8px 2px rgba(128,0,128,0.7)",
          "0 0 16px 4px rgba(186,85,211,0.9)",
          "0 0 8px 2px rgba(128,0,128,0.7)",
        ],
        transition: {
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        },
      });
    } else {
      controls.stop();
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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const StatusBadge = ({ status }: { status: string }) => {
    let bgClasses = "";
    let text = "";
    let Icon = null;

    switch (status.toLowerCase()) {
      case "live":
        bgClasses = "bg-gradient-to-r from-purple-600 to-purple-500";
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
        boxShadow: "0 0 25px 7px rgba(186,85,211,0.7)",
        transition: { duration: 0.3 },
      }}
      className={`relative w-full h-[500px] group rounded-lg overflow-hidden cursor-pointer bg-gradient-to-br from-purple-900 to-purple-800 text-white select-none ${
        shake ? "animate-shake" : ""
      }`}
    >
      <Image
        src={FALLBACK_IMAGE}
        alt={auction.item_name || "Reverse Auction"}
        width={700}
        height={288}
        className="brightness-90 group-hover:brightness-110 transition duration-300 object-cover rounded-t-lg"
      />

      <StatusBadge status={auction.status} />

      <div className="p-5 flex flex-col justify-between h-[calc(100%-288px)] relative bg-gradient-to-t from-black/80 to-transparent">
        <div>
          <h3 className="text-2xl font-bold">{auction.item_name}</h3>
          <p className="mt-2 text-lg">
            Lowest Bid:{" "}
            <span className="font-extrabold text-purple-300">
              ${auction.highest_bid?.toFixed(2) ?? "—"}
            </span>
          </p>
          <p className="mt-1 text-sm text-gray-300">
            Time Left: {formatTime(timeLeft)}
          </p>
        </div>

        {auction.status === "live" && !isBidding && (
          <div className="mt-5 flex justify-center">
            {/* Button NOT absolute, NOT covering whole card */}
            <motion.button
              onClick={handleBidNow}
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 10px 3px rgba(186,85,211,0.9)",
              }}
              animate={{
                boxShadow: [
                  "0 0 12px 4px rgba(186,85,211,0.9)",
                  "0 0 20px 8px rgba(128,0,128,0.8)",
                  "0 0 12px 4px rgba(186,85,211,0.9)",
                ],
              }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="px-6 py-3 rounded-md border border-purple-400 bg-purple-600 font-bold text-white backdrop-blur-sm transition-all duration-300 ease-in-out"
              type="button"
            >
              Place Lower Bid
            </motion.button>
          </div>
        )}
      </div>

      {/* Overlay covers entire card during bidding */}
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
