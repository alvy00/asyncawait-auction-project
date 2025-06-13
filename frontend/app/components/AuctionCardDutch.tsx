/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaBolt, FaHourglassHalf, FaStopwatch } from "react-icons/fa";
import { Auction } from "../../lib/interfaces";
import Image from "next/image";
import { Countdown } from "./Countdown";
import toast from "react-hot-toast";

interface AuctionCardProps {
  auction: Auction;
}

const AuctionCardDutch: React.FC<AuctionCardProps> = ({ auction }) => {
  const controls = useAnimation();
  const [isBidding, setIsBidding] = useState(false);
  const [submittingBid, setSubmittingBid] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(auction.starting_price);
  const [user, setUser] = useState(null);
  const [shake, setShake] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const FALLBACK_IMAGE = "/fallback.jpg";
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken")
      : null;

  useEffect(() => {
    const getUser = async () => {
      const token =
        localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
      if (!token) return;

      try {
        const res = await fetch("https://asyncawait-auction-project.onrender.com/api/getuser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch user");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (e) {
        console.error("Error fetching user:", e);
      }
    };
    getUser();
  }, []);

  const submitBid = async () => {
    setSubmittingBid(true);
    setShowConfirmModal(false);

    try {
      const body = {
        auction_id: auction.auction_id,
        amount: currentPrice,
      };

      const res = await fetch(
        "https://asyncawait-auction-project.onrender.com/api/auctions/bidcurrent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        toast.error(error?.message || "Failed to place bid.");
        return;
      }

      toast.success(`You won the auction!`);
      setIsBidding(false);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmittingBid(false);
    }
  };

  const handleAcceptClick = () => {
    setShowConfirmModal(true);
  };

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
      const newPrice = auction.starting_price - priceDrop * (elapsed / totalDuration);
      setCurrentPrice(newPrice);
    };

    updatePrice();
    const interval = setInterval(updatePrice, 1000);
    return () => clearInterval(interval);
  }, [auction.start_time, auction.end_time, auction.starting_price]);

  useEffect(() => {
    if (auction.status === "live") {
      controls.start({
        scale: [1, 1.05, 1],
        opacity: [1, 0.75, 1],
        transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
      });
    } else {
      controls.stop();
      controls.set({ scale: 1, opacity: 1 });
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

  const StatusBadge = ({ status }: { status: string }) => {
    let bgClasses = "";
    let text = "";
    let Icon = null;

    switch (status.toLowerCase()) {
      case "live":
        bgClasses = "bg-gradient-to-r from-blue-500 to-blue-400";
        text = "DUTCH | LIVE";
        Icon = FaHourglassHalf;
        break;
      case "upcoming":
        bgClasses = "bg-gradient-to-r from-yellow-500 to-yellow-400";
        text = "DUTCH | UPCOMING";
        Icon = FaBolt;
        break;
      case "ended":
        bgClasses = "bg-gradient-to-r from-gray-700 to-gray-600";
        text = "DUTCH | ENDED";
        Icon = FaStopwatch;
        break;
      default:
        return null;
    }

    return (
      <motion.div
        animate={status.toLowerCase() === "live" ? controls : { scale: 1 }}
        className={`${bgClasses} text-white text-xs font-bold px-4 py-1 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm absolute top-4 left-4 z-10`}
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
        scale: 1.015,
        boxShadow: "0 0 14px 4px rgba(0,191,255,0.45)",
        transition: { duration: 0.35, ease: "easeOut" },
      }}
      className={`relative w-full h-[500px] rounded-lg overflow-hidden bg-gradient-to-br from-white-900 to-blue-800 text-white border border-white/20 select-none ${
        shake ? "animate-shake" : ""
      }`}
    >
      <div className="relative h-[55%] w-full overflow-hidden">
        <Image
          src={FALLBACK_IMAGE}
          alt={auction.item_name}
          fill
          style={{ objectFit: "cover" }}
          className="brightness-90 object-cover transition-transform duration-700 group-hover:scale-110"
          priority
        />
      </div>

      <StatusBadge status={auction.status} />

      <div className="p-5 h-[45%] flex flex-col justify-between bg-gradient-to-t from-black/80 to-transparent min-h-[150px]">
        <div>
          <h3 className="text-2xl font-bold">{auction.item_name}</h3>
          <p className="mt-2 text-lg">
            Current Price:{" "}
            <span className="font-extrabold text-cyan-400">${currentPrice.toFixed(2)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-orange-400 mt-3">
          <span className="text-white bg-white/5 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10 font-mono tracking-wide">
            <Countdown endTime={auction.end_time} />
          </span>
        </div>
      </div>

      {/* Bid Button + Modal */}
      {auction.status === "live" && !submittingBid && (
        <div className="absolute bottom-5 right-5 z-20 flex flex-col items-end">
          <motion.button
            onClick={handleAcceptClick}
            whileTap={{ scale: 0.95 }}
            disabled={showConfirmModal}
            className={`px-6 py-3 rounded-md border font-bold text-white backdrop-blur-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-400
              ${showConfirmModal
                ? "bg-cyan-400 cursor-not-allowed opacity-60"
                : "bg-cyan-600 hover:bg-cyan-500 border-cyan-400 cursor-pointer"}
            `}
          >
            Accept Price
          </motion.button>

          {/* Tooltip-style Confirmation */}
          {showConfirmModal && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-[60px] right-0 w-64 bg-white text-gray-800 rounded-lg shadow-xl z-30 border border-gray-200"
            >
              {/* Triangle pointer */}
              <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white rotate-45 border-l border-b border-gray-200"></div>
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-2 text-center">Confirm Your Bid</h3>
                <p className="text-center text-sm mb-4">
                  Accept <strong>${currentPrice.toFixed(2)}</strong>?
                </p>
                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="w-full px-3 py-1.5 rounded-md bg-gray-200 text-sm hover:bg-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitBid}
                    className="w-full px-3 py-1.5 rounded-md bg-cyan-600 text-white text-sm hover:bg-cyan-700 font-semibold cursor-pointer"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {submittingBid && (
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
          @keyframes gentle-shake {
            0%, 100% { transform: translateX(0); }
            30% { transform: translateX(-0.3px); }
            50% { transform: translateX(0.3px); }
            70% { transform: translateX(-0.2px); }
          }
          .animate-shake {
            animation: gentle-shake 0.4s ease-in-out;
          }
        `}
      </style>
    </motion.div>
  );
};

export default AuctionCardDutch;
