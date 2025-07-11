/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import Image from "next/image";
import toast from "react-hot-toast";
import { Auction, User } from "../../lib/interfaces";
import { motion } from "framer-motion";
import { Countdown } from "./Countdown";
import AuctionDetailsModal from "./AuctionDetailsModal";
import { FaBolt, FaBullhorn, FaClock, FaFlagCheckered, FaGavel } from "react-icons/fa";
import FavoriteBadge from "./FavouriteBadge";

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
  const [detailsOpen, setDetailsOpen] = useState(false);
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
        setSubmittingBid(false);
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
      setSubmittingBid(false);
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

        const updateStatusEnd = async () => {
          const data = {
            auction_id: auction.auction_id,
            status: "ended"
          };
          try {
            const res = await fetch('https://asyncawait-auction-project.onrender.com/api/auctions/updatestatus', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });

            if (res.ok) {
              const json = await res.json();
              console.log(json.message);
            } else {
              console.error('Failed to update auction status', res.status);
            }
          } catch (e) {
            console.error(e);
          }
        };
        updateStatusEnd();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [auction.start_time, auction.end_time, refresh, auction.auction_id]);



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

      {/* Background & Glass layers */}
      <div className="relative h-full overflow-hidden rounded-lg bg-gradient-to-br from-green-900 to-black-800 to-transparent backdrop-blur-xl shadow-2xl border border-white/20">
        {/* Glassmorphism glow effects */}
        <div className="absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl">
          <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-blue-500/10 opacity-30 group-hover:opacity-40 transition-opacity duration-700"></div>
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/5 to-transparent rotate-12 transform scale-2 opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
        </div>

        {/* Image */}
        <div className="relative h-[55%] overflow-hidden">
          <Image
            src={imageSrc}
            alt={auction.item_name}
            fill
            onClick={() => setDetailsOpen(true)}
            className="brightness-90 group-hover:brightness-110 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div onClick={() => setDetailsOpen(true)} className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>

          {/* Status badge with scoped tooltip */}
          <div className="absolute top-4 left-4 z-10 cursor-pointer">
            <div className="relative group/status">
              {currentStatus === "upcoming" ? (
                <div className="bg-gradient-to-r from-green-700 to-green-500 text-white text-xs font-semibold px-4 py-1 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm">
                  <FaClock className="text-white" />
                  <span>CLASSIC | UPCOMING</span>
                </div>
              ) : currentStatus === "live" ? (
                <div className="bg-gradient-to-r from-green-700 to-green-500 text-white text-xs font-semibold px-4 py-1 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm">
                  <FaBolt className="text-white animate-pulse" />
                  <span>CLASSIC | LIVE</span>
                </div>
              ) : (
                <div className="bg-gray-600 text-white text-xs font-medium px-4 py-1 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm">
                  <FaFlagCheckered className="text-white" />
                  <span>CLASSIC | ENDED</span>
                </div>
              )}

              {/* Tooltip shown only when hovering status */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 text-[11px] text-emerald-100 bg-emerald-900/80 rounded-md shadow-xl opacity-0 group-hover/status:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20 backdrop-blur-sm">
                <span className="block text-center tracking-wide">The highest bidder wins</span>

                {/* Soft-glow arrow */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-emerald-900/80 shadow-md" />
              </div>

            </div>
          </div>

          {/* Favorite button - Updated to show on group hover */}
          <FavoriteBadge
            userId={user?.user_id}
            auctionId={auction.auction_id}
            initialFavorited={isFavourited}
            isHovered={isHovered}
          />
          
        </div>

        {/* Content */}
        <div className="p-6 bg-gradient-to-b from-black/50 via-black/70 to-black/80 backdrop-blur-md relative z-10 h-[45%] flex flex-col justify-between border-t border-white/10">
          <div onClick={() => setDetailsOpen(true)}>
            <h3 className="text-2xl font-bold tracking-wide uppercase mb-2 text-green-100 drop-shadow-sm cursor-pointer">
              #{auction.item_name}
            </h3>

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

          {/* Price + Countdown */}
          <div className="flex items-center justify-between mb-4">
            <div onClick={() => setDetailsOpen(true)} className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500 font-bold text-3xl">
              {highestBid
                ? `$${highestBid.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : `$${auction.starting_price.toFixed(2)}`
              }
              {highestBid && winner && (
                <div className="text-sm font-normal text-white/80 mt-1">by {winner}</div>
              )}
            </div>

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

          {/* Footer */}
          <div className="flex items-center justify-between">
            {auctionCreator && (
              <div className="flex items-center text-white text-sm bg-white/5 backdrop-blur-sm px-2 py-1 rounded-lg">
                <span className="mr-2">👤</span>
                {auctionCreator}
              </div>
            )}

            {/* Bid button / form */}
            <div className="relative h-12 w-[160px] transition-all duration-500">
              {!token ? (
                <Button
                  disabled
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-400 opacity-60 cursor-not-allowed shadow-inner ring-1 ring-inset ring-gray-600/30"
                >
                  <span>Login to bid</span>
                </Button>
              ) : ( !isEnded &&
                <div className={`relative w-full h-full ${shake ? "animate-shake" : ""}`}>
                  <div
                    className={`absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-500 ease-in-out z-10 ${
                      isBidding ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
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

                  {/* Bid form */}
                  <form
                    onSubmit={handleBidSubmit}
                    className={`absolute inset-0 w-full h-full flex items-center justify-center gap-2 transition-all duration-500 ease-in-out z-0 ${
                      isBidding ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    <input
                      type="number"
                      name="amount"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      min={
                        auction.starting_price === highestBid
                          ? auction.starting_price
                          : Math.max(auction.starting_price, highestBid) + 1
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
          </div>
        </div>
        
        {/* Submitting overlay */}
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
        onClose={() => {
          console.log("Closing modal");
          setDetailsOpen(false);
        }}
        auction={auction}
      />

      {/* Shake animation */}
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
          
          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: scale(0.95) translateX(-50%);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateX(-50%);
            }
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
