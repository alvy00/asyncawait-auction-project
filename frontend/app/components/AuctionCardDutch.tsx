/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaArrowDown, FaBolt, FaHourglassHalf, FaStopwatch, FaTag } from "react-icons/fa";
import Image from "next/image";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { Auction, User } from "../../lib/interfaces";
import { Countdown } from "./Countdown";
import StatusBadge from "./StatusBadge";
import FavoriteBadge from "./FavouriteBadge";
import AuctionDetailsModal from "./AuctionDetailsModal";
import {
  cardBase,
  cardImageContainer,
  cardImage,
  cardOverlay,
  cardStatusBadge,
  cardFavoriteBadge,
  cardContent,
  cardTitle,
  cardLabel,
  cardPrice,
  cardCountdown,
  cardFooter,
  cardCreatorBadge,
  cardBidButton,
  getCardAccent
} from "./auction-detail/CardStyleSystem";

interface AuctionCardProps {
  auction: Auction;
  auctionCreator: string;
  user: User;
}

const AuctionCardDutch: React.FC<AuctionCardProps> = ({ auction: initialAuction, auctionCreator, user }) => {
  const controls = useAnimation();
  const [auction, setAuction] = useState(initialAuction);
  const [isBidding, setIsBidding] = useState(false);
  const [submittingBid, setSubmittingBid] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(initialAuction.starting_price);
  const [shake, setShake] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const imageSrc = auction.images?.[0]?.trim() ? auction.images[0] : "/fallback.jpg";
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken")
      : null;

  // fetch user
  // useEffect(() => {
  //   const getUser = async () => {
  //     const token =
  //       localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
  //     if (!token) return;

  //     try {
  //       const res = await fetch("https://asyncawait-auction-project.onrender.com/api/getuser", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (res.ok) {
  //         const data = await res.json();
  //         setUser(data);
  //       }
  //     } catch (e) {
  //       console.error("Error fetching user:", e);
  //     }
  //   };
  //   getUser();
  // }, []);

  // handle bid
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
      setAuction((prev) => ({
        ...prev,
        status: "ended",
        end_time: new Date().toISOString(),
        highest_bid: currentPrice,
      }));
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmittingBid(false);
    }
  };

  const handleAcceptClick = () => {
    setShowConfirmModal(true);
  };

  // price drop mechanism
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

  const accent = getCardAccent("dutch");

  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{
      scale: 1.02,
      boxShadow: "0 0 8px 2px rgba(0, 140, 255, 0.5)",
      transition: { duration: 0.35, ease: "easeOut" },
    }}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    className={`${cardBase} bg-gradient-to-br from-cyan-800/90 to-cyan-800/50 backdrop-blur-xl border border-emerald-700/30 rounded-2xl shadow-inner shadow-emerald-900/20 transition-all duration-300`}
    >
    {/* Image container */}
    <div className={cardImageContainer} >
      <Image src={imageSrc} alt={auction.item_name} fill className={cardImage} priority onClick={() => setDetailsOpen(true)}/>
      <div className={cardStatusBadge}>
        <StatusBadge type={"dutch"} status={auction.status} auctionId={auction.auction_id} participantCount={auction.participants} />
      </div>
      <div className={cardFavoriteBadge}>
        <FavoriteBadge userId={user?.user_id} auctionId={auction.auction_id} initialFavorited={auction.isFavorite} isHovered={isHovered} />
      </div>
    </div>

    {/* Info section */}
    <div className={cardContent}>
      <div onClick={() => setDetailsOpen(true)}>
        <h3 className={`${cardTitle} text-blue-300 cursor-pointer`}>#{auction.item_name}</h3>
        <div className="flex items-center gap-2 text-sm text-blue-300 font-medium mt-1">
          <FaTag className="text-blue-400" />
          Original Price: <span className="font-bold text-blue-100">${auction.starting_price.toFixed(2)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-1 text-blue-300">
          <span className="flex items-center gap-2 font-semibold">
            <FaArrowDown className="text-blue-400" />
            Price dropped to:
          </span>
          <span className={`${cardPrice} inline-block text-white text-lg font-bold px-3 py-1 rounded shadow-inner ring-1 ring-blue-500/20`}>
            ${currentPrice.toFixed(2)} 
            <span className="text-sm text-lime-400 font-semibold ml-2">
              ({Math.round(((auction.starting_price - currentPrice) / auction.starting_price) * 100)}%)
            </span>
          </span>
        </div>
      </div>

      <div onClick={() => setDetailsOpen(true)} className={cardFooter}>
        <div className={cardCountdown}>
          <Countdown endTime={auction.end_time} />
        </div>
        {auctionCreator && (
          <div className="text-blue-300 text-xs md:text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {auctionCreator}
          </div>
        )}
      </div>

      {/* Bid button area */}
      {auction.status === "live" && !submittingBid && (
        <div className="w-full mt-2 flex flex-col items-end">
          {!token ? (
            <Button
              disabled
              className="w-full flex items-center justify-center gap-2 rounded-full bg-gray-800 border border-gray-700 text-gray-400 opacity-60 cursor-not-allowed shadow-inner ring-1 ring-inset ring-gray-600/30"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728" />
              </svg>
              <span className="text-sm">Login to bid</span>
            </Button>
          ) : auction?.user_id !== user?.user_id ? (
            <motion.button
              onClick={handleAcceptClick}
              whileTap={{ scale: 0.95 }}
              disabled={showConfirmModal}
              className={`px-6 py-3 font-bold text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 border border-blue-500 transition-all duration-300
                ${showConfirmModal
                  ? "bg-blue-400 cursor-not-allowed opacity-60"
                  : "bg-blue-500 hover:bg-blue-600 hover:shadow-md cursor-pointer"
                }`}
            >
              Accept Price
            </motion.button>
          ) : (
            <div className="w-full flex items-center justify-center rounded-full border border-gray-500 bg-gray-800 text-gray-300 font-medium cursor-not-allowed shadow-inner text-sm">
              You created this auction
            </div>
          )}

          {showConfirmModal && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-[60px] right-0 w-64 bg-white text-gray-800 rounded-lg shadow-xl z-30 border border-gray-200"
            >
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
                    className="w-full px-3 py-1.5 rounded-md bg-blue-700 text-white text-sm hover:bg-blue-600 font-semibold cursor-pointer"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Overlay during bidding */}
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
    </div>

    {/* Auction details Modal */}
    <AuctionDetailsModal
      open={detailsOpen}
      onClose={() => setDetailsOpen(false)}
      auction={auction}
  />

    {/* Shake animation styles */}
    <style>{`
      @keyframes gentle-shake {
        0%, 100% { transform: translateX(0); }
        30% { transform: translateX(-0.3px); }
        50% { transform: translateX(0.3px); }
        70% { transform: translateX(-0.2px); }
      }
      .animate-shake {
        animation: gentle-shake 0.4s ease-in-out;
      }
    `}</style>
  </motion.div>
  );
};

export default AuctionCardDutch;
