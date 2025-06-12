import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaBolt, FaHourglassHalf, FaStopwatch } from "react-icons/fa";
import { Auction } from "../../lib/interfaces";
import Image from "next/image";

interface AuctionCardProps {
  auction: Auction;
  onBid: () => void;
}

const AuctionCardDutch: React.FC<AuctionCardProps> = ({ auction, onBid }) => {
  const controls = useAnimation();
  const [isBidding, setIsBidding] = useState(false);
  const [shake, setShake] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(auction.starting_price);
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
    const startTimestamp = new Date(auction.start_time).getTime();
    const endTimestamp = new Date(auction.end_time).getTime();
    const totalDuration = endTimestamp - startTimestamp;
    const endingPrice = auction.starting_price * 0.25;
    const priceDrop = auction.starting_price - endingPrice;
    const updatePrice = () => {
      const now = Date.now();
      if (now >= endTimestamp) {
        setCurrentPrice(endingPrice);
        return;
      }
      if (now <= startTimestamp) {
        setCurrentPrice(auction.starting_price);
        return;
      }
      const elapsed = now - startTimestamp;
      const newPrice = auction.starting_price - (priceDrop * (elapsed / totalDuration));
      setCurrentPrice(newPrice);
    };
    updatePrice();
    const priceInterval = setInterval(updatePrice, 1000);
    return () => clearInterval(priceInterval);
  }, [auction.start_time, auction.end_time, auction.starting_price]);

  useEffect(() => {
    if (auction.status === "live") {
      controls.start({
        scale: [1, 1.07, 1], // softer pulse scale
        opacity: [1, 0.85, 1],
        boxShadow: [
          "0 0 4px 1px rgba(30,144,255,0.4)", // very soft glow
          "0 0 6px 2px rgba(0,191,255,0.5)",
          "0 0 4px 1px rgba(30,144,255,0.4)",
        ],
        transition: {
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        },
      });
    } else {
      controls.stop();
      controls.set({ scale: 1, boxShadow: "none", opacity: 1 });
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
        bgClasses = "bg-gradient-to-r from-blue-500 to-blue-400";
        text = "DUTCH LIVE";
        Icon = FaHourglassHalf;
        break;
      case "upcoming":
        bgClasses = "bg-gradient-to-r from-yellow-500 to-yellow-400";
        text = "DUTCH UPCOMING";
        Icon = FaBolt;
        break;
      case "ended":
        bgClasses = "bg-gradient-to-r from-gray-700 to-gray-600";
        text = "DUTCH ENDED";
        Icon = FaStopwatch;
        break;
      default:
        return null;
    }

    return (
      <motion.div
        initial={{ scale: 1, boxShadow: "none", opacity: 1 }}
        animate={status.toLowerCase() === "live" ? controls : { scale: 1, boxShadow: "none", opacity: 1 }}
        className={`${bgClasses} text-white text-xs font-bold px-4 py-1 z-10 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm absolute top-4 left-4`}
        style={{ boxShadow: "inherit" }}
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
        boxShadow: "0 0 25px 7px rgba(0,191,255,0.8)",
        transition: { duration: 0.3 },
      }}
      className={`relative w-full h-[500px] group rounded-lg overflow-hidden cursor-pointer bg-gradient-to-br from-blue-900 to-blue-800 text-white select-none ${
        shake ? "animate-shake" : ""
      }`}
    >
      <Image
        src={FALLBACK_IMAGE}
        alt={auction.item_name || "Dutch Auction"}
        width={700}
        height={288}
        className="brightness-90 group-hover:brightness-110 transition duration-300 object-cover rounded-t-lg"
      />

      <StatusBadge status={auction.status} />

      <div className="p-5 flex flex-col justify-between h-[calc(100%-288px)] bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-2xl font-bold">{auction.item_name}</h3>
        <p className="mt-2 text-lg">
          Current Price:{" "}
          <span className="font-extrabold text-cyan-400">${currentPrice.toFixed(2)}</span>
        </p>
        <p className="mt-1 text-sm text-gray-300">Time Left: {formatTime(timeLeft)}</p>
      </div>

      {auction.status === "live" && !isBidding && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10">
          <motion.button
            onClick={handleBidNow}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 10px 3px rgba(0,191,255,0.9)",
            }}
            animate={{
              boxShadow: [
                "0 0 12px 4px rgba(0,191,255,1)",
                "0 0 20px 8px rgba(30,144,255,0.8)",
                "0 0 12px 4px rgba(0,191,255,1)",
              ],
            }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="px-6 py-3 rounded-md border border-cyan-400 bg-cyan-600 font-bold text-white backdrop-blur-sm transition-all duration-300 ease-in-out"
          >
            Accept Price
          </motion.button>
        </div>
      )}

      {isBidding && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-xl font-bold text-white z-20 pointer-events-none">
          Accepting Price...
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

export default AuctionCardDutch;
