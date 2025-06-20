/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import Image from "next/image";
import toast from "react-hot-toast";
import { Auction, User } from "../../lib/interfaces";
import { motion } from "framer-motion";
import { Countdown } from "./Countdown";
import { FaBolt, FaBullhorn, FaClock, FaFlagCheckered, FaGavel } from "react-icons/fa";

const FALLBACK_IMAGE = "/fallback.jpg";

interface AuctionCardProps {
  auction: Auction;
  auctionCreator: string;
  isFavourited: boolean;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, auctionCreator, isFavourited })  => {
  const [winner, setWinner] = useState(null);
  const [isEnded, setIsEnded] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isBidding, setIsBidding] = useState(false);
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
  const [highestBid, setHighestBid] = useState(auction.highest_bid);
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [currentStatus, setCurrentStatus] = useState<"upcoming" | "live" | "ended">(() => {
    const now = new Date();
    if (now < new Date(auction.start_time)) return "upcoming";
    if (now <= new Date(auction.end_time)) return "live";
    return "ended";
  });
  const [favourited, setFavourited] = useState(isFavourited);
  const [refresh, setRefresh] = useState(false);
  const [shake, setShake] = useState(false);

  const imageSrc = auction.images?.[0]?.trim() ? auction.images[0] : FALLBACK_IMAGE;
  const token = typeof window !== "undefined" ? localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken") : null;

  // fetch user
  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem('sessionToken') || sessionStorage.getItem('sessionToken');
      if (!token) {
        console.warn('No token found');
        return;
      }

      try {
        const res = await fetch('https://asyncawait-auction-project.onrender.com/api/getuser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          console.error('Failed to fetch user:', err.message);
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (e) {
        console.error('Error fetching user:', e);
      }
    };
    getUser();
  }, []);

  // get highest bidder
  useEffect(() => {
    const getHighestBidder = async () => {
      const userId = auction?.highest_bidder_id;

      if (!userId) {
        console.log("Missing highest_bidder_id");
        return;
      }

      try {
        // https://asyncawait-auction-project.onrender.com/api/fetchuser
        // http://localhost:8000/api/fetchuser
        const res = await fetch('https://asyncawait-auction-project.onrender.com/api/fetchuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });

        if (!res.ok) {
          const errorBody = await res.text();
          //console.error('Failed to fetch user. Status:', res.status, 'Response:', errorBody);
          return;
        }

        const data = await res.json();
        //console.log('Fetched user:', data.name);
        setWinner(data.name);
        return data;
      } catch (err) {
        console.error('Fetch exception:', err);
      }
    };

    getHighestBidder();
  }, [auction?.highest_bidder_id, refresh])
  
  // submit bid
  const handleBidSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittingBid(true);

    try {
      const formData = new FormData(e.currentTarget);
      const amountStr = formData.get('amount');
      const bidAmount = amountStr ? parseFloat(amountStr.toString()) : 0;

      if (bidAmount > user.money) {
        toast.error("Insufficient balance, please deposit more money!");
        setSubmittingBid(false);
        return;
      }

      const body = {
        auction_id: auction.auction_id,
        amount: bidAmount,
      };

      const res = await fetch("https://asyncawait-auction-project.onrender.com/api/auctions/bid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Error placing bid:", error);
        toast.error(error?.message || "Failed to place bid.");
        return;
      }

      toast.success(`Bid of $${bidAmount.toFixed(2)} placed successfully!`);
      setHighestBid(bidAmount);
      setWinner(user.name);
      setIsBidding(false);
      setSubmittingBid(false);
      setRefresh(prev => !prev);
    } catch (err) {
      console.error("Bid submission error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // animation
  const handleMouseLeave = () => {
    setIsBidding(false);
    setIsHovered(false);
  };

  // checks whether the auction has started or not
  useEffect(() => {
    const hasStarted = new Date(auction.start_time) <= new Date();
    setIsStarted(hasStarted);
  }, [auction.start_time]);

  // sets isEnded
  useEffect(() => {
    const hasEnded = new Date(auction.end_time) <= new Date();
    setIsEnded(hasEnded);
  }, [auction.end_time]);

  // updates currentStatus every min
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now < new Date(auction.start_time)) {
        setCurrentStatus("upcoming");
      } else if (now <= new Date(auction.end_time)) {
        setCurrentStatus("live");
      } else {
        setCurrentStatus("ended");
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [auction.start_time, auction.end_time, refresh]);

  // handle fav click
  const handleFavoriteClick = async () => {
    const url = favourited
      ? 'https://asyncawait-auction-project.onrender.com/api/auctions/unfavourite'
      : 'https://asyncawait-auction-project.onrender.com/api/auctions/favourite';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.user_id,
          auction_id: auction.auction_id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update favorite status');
      }

      toast.success(favourited ? 'Removed from favorites' : 'Added to favorites');
      setFavourited((prev) => !prev);
    } catch (error) {
      console.error('Favorite toggle error:', error);
      toast.error(error.message || 'Something went wrong');
    }
  };

  // shake effect
  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => {
        setShake(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [shake]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0 3.5px 1px rgba(42, 254, 42, 0.5)",
        transition: { duration: 0.35, ease: "easeOut" },
      }}
      className="relative w-full h-[500px] group overflow-hidden rounded-lg 
        bg-gradient-to-br from-[#0f2d21] via-[#1b4332] to-[#2d6a4f]
        backdrop-blur-xl shadow-2xl border border-white/20 text-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card content */}
      <div className="relative h-full overflow-hidden rounded-lg bg-gradient-to-br from-green-900 to-black-800 to-transparent backdrop-blur-xl shadow-2xl border border-white/20">
        {/* Glassmorphism card highlights */}
        <div className="absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl">
          <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-blue-500/10 opacity-30 group-hover:opacity-40 transition-opacity duration-700"></div>
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/5 to-transparent rotate-12 transform scale-2 opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
        </div>
        
        {/* Image container with zoom effect */}
        <div className="relative h-[55%] overflow-hidden">
          <Image 
            src={imageSrc} 
            alt={auction.item_name}
            fill
            className="brightness-90 group-hover:brightness-110 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Glass overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
          
          {/* Status tag */}
          {currentStatus === "upcoming" ? (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-green-700 to-green-500 text-white text-xs font-semibold px-4 py-1 z-10 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm">
            <FaClock className="text-white" />
            <span>REGULAR | UPCOMING</span>
          </div>
          ) : currentStatus === "live" ? (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-green-700 to-green-500 text-white text-xs font-semibold px-4 py-1 z-10 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm">
              <FaBolt className="text-white animate-pulse" />
              <span>REGULAR | LIVE</span>
            </div>
          ) : (
            <div className="absolute top-4 left-4 bg-gray-600 text-white text-xs font-medium px-4 py-1 z-10 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm">
              <FaFlagCheckered className="text-white" />
              <span>REGULAR | ENDED</span>
            </div>
          )}
          
          
          {/* Favorite button - Updated to show on group hover */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.8
            }}
            transition={{ duration: 0.2 }}
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full z-10 transition-all duration-300 hover:scale-110 border border-white/20 shadow-lg"
          >
            {favourited ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </motion.button>
        </div>
        
        {/* Content with glass background effect */}
        <div className="p-6 bg-gradient-to-b from-black/50 via-black/70 to-black/80 backdrop-blur-md relative z-10 h-[45%] flex flex-col justify-between border-t border-white/10">
          <div>
            <h3
              className="text-2xl font-bold tracking-wide uppercase mb-2 
                        text-green-100 drop-shadow-sm"
            >
              #{auction.item_name}
            </h3>
            
            {/* Bidding starts / Current Bid Label */}
            <div className={`text-gray-400 text-xs mb-1 font-medium ${isEnded ? "opacity-0" : ""}`}>
              {!highestBid ? (
                <span className="text-gray-300 flex items-center gap-1">
                  <FaBullhorn className="text-yellow-400" />
                  Bidding starts at:
                </span>
              ) : (
                <span className="text-gray-300 flex items-center gap-1">
                  <FaGavel className="text-orange-400" />
                  Current bid:
                </span>
              )}
            </div>
          </div>
          
          {/* Price and time */}
          <div className="flex-grow">
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-4">
                {!isEnded && (
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500 font-bold text-3xl flex flex-col">
                    {!highestBid ? (
                      `$${auction.starting_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    ) : (
                      <>
                        {/* Higest bid and name */}
                        <span>${highestBid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <div className="text-sm font-normal text-white/80 mt-1 flex items-center">
                          <span className="mr-1">by</span>
                          <div className="hover:underline transition-all duration-200">
                            {winner || "—"}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="text-white text-sm bg-white/5 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10">
                  {isEnded ? (
                    winner ? (
                      <span className="text-green-400 font-bold animate-pulse">🎉 {winner} won!</span>
                    ) : (
                      <span className="text-red-400 font-semibold">❌ Expired</span>
                    )
                  ) : (
                    <Countdown endTime={auction.end_time} onComplete={() => setIsEnded(true)} />
                  )}
                </div>
              </div>
            </div>

            {/* Seller and bid button */}
            <div className="flex items-center justify-between">
              {auctionCreator && (
                <div className="flex items-center text-white text-sm bg-white/5 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {auctionCreator}
                </div>
              )}

              {/* Bid Area with Transition */}
              <div className="absolute bottom-5 right-5 z-10">
                {!token ? (
                  <Button
                    disabled
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md 
                      bg-gray-800 border border-gray-700 text-gray-400 opacity-60 
                      cursor-not-allowed shadow-inner ring-1 ring-inset ring-gray-600/30"
                  >
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728"
                      />
                    </svg>
                    <span className="text-sm">Login to bid</span>
                  </Button>
                ) : (
                  <div className="relative h-12 w-[160px] transition-all duration-500">
                    {currentStatus === "live" && (
                      <div className={`relative w-full h-full ${shake ? "animate-shake" : ""}`}>
                        {/* Bid Now Button */}
                        <div
                          className={`absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-500 ease-in-out z-10 ${
                            isBidding
                              ? "opacity-0 scale-95 pointer-events-none"
                              : "opacity-100 scale-100 pointer-events-auto"
                          }`}
                        >
                          <button
                            onClick={() => {
                              setIsBidding(true);
                              setShake(true);
                              setTimeout(() => setShake(false), 600);
                            }}
                            type="button"
                            className="w-full h-full flex items-center justify-center rounded-md border border-emerald-700 bg-emerald-800 hover:bg-emerald-700 font-medium text-white backdrop-blur-sm transition-all duration-300 ease-in-out cursor-pointer"
                          >
                            Place Bid
                          </button>
                        </div>

                        {/* Bid Form (Animated) */}
                        <form
                          onSubmit={handleBidSubmit}
                          className={`absolute inset-0 w-full h-full flex items-center justify-center gap-2 transition-all duration-500 ease-in-out z-0 ${
                            isBidding
                              ? "opacity-100 translate-x-0 scale-100 blur-none pointer-events-auto"
                              : "opacity-0 -translate-x-4 scale-95 blur-sm pointer-events-none"
                          }`}
                        >
                          <input
                            type="number"
                            name="amount"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(Number(e.target.value))}
                            min={
                              auction.starting_price === auction.highest_bid
                                ? auction.starting_price
                                : Math.max(auction.starting_price, auction.highest_bid) + 1
                            }
                            placeholder="Your bid"
                            className="w-2/3 max-w-[100px] p-2 rounded-lg border bg-gray-800 text-white border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400 transition"
                          />
                          <button
                            type="submit"
                            disabled={submittingBid}
                            className={`px-3 py-2 bg-emerald-800 text-white font-semibold rounded-lg border border-emerald-700 shadow hover:bg-emerald-700 hover:border-emerald-500 transition-all duration-300 ease-in-out cursor-pointer ${
                              submittingBid ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            Bid
                          </button>
                        </form>

                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

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

      {/* Shake animation styles */}
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

export default AuctionCard;

// Add custom styles for animations
const styles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
  
  @keyframes pulse-slow {
    0% { opacity: 0.5; }
    50% { opacity: 0.7; }
    100% { opacity: 0.5; }
  }
  
  .animate-float {
    animation: float 8s ease-in-out infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
