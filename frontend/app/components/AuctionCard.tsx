/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import Image from "next/image";
import toast from "react-hot-toast";
import { Auction } from "../../lib/interfaces";
import { AnimatePresence, motion } from "framer-motion";
import { title } from "process";
import { cn } from "../../lib/utils";
import { Countdown } from "./Countdown";

const FALLBACK_IMAGE = "/fallback.jpg";


const AuctionCard = ({ auction, auctionCreator }: { auction: Auction; auctionCreator: string }) => {
  const [winner, setWinner] = useState(null);
  const [isEnded, setIsEnded] = useState(false);
  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
  const [highestBid, setHighestBid] = useState(auction.highest_bid);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);


  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setTimeLeft(formatTimeLeft(auction.end_time));
  //   }, 1000);
    
  //   return () => clearInterval(timer);
  // }, [auction.end_time]);

  const imageSrc = auction.images?.[0]?.trim() ? auction.images[0] : FALLBACK_IMAGE;
  const token = typeof window !== "undefined" ? localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken") : null;


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
          const errorBody = await res.text(); // Use .text() to see raw response
          console.error('Failed to fetch user. Status:', res.status, 'Response:', errorBody);
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
  }, [auction?.highest_bidder_id])
  

  const handleBidSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
        const formData = new FormData(e.currentTarget);
        
        const body = {
          auction_id: auction.auction_id,
          amount: formData.get('amount'),
        };
        
        // https://asyncawait-auction-project.onrender.com/api/auctions/bid
        // http://localhost:8000/api/auctions/bid
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

        toast.success(`Bid of $${bidAmount} placed successfully!`);
        setHighestBid(bidAmount);
        setIsBidding(false);

      } catch (err) {
        console.error("Bid submission error:", err);
        toast.error("Something went wrong. Please try again.");
      }
  };

  const handleMouseLeave = () => {
    setIsBidding(false);
    setIsHovered(false);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      toast.success('Favorited')
      
  };


  return (
    <>
      
      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={cn(
            "relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-2xl shadow-2xl hover:shadow-3xl border border-white/20 transition-all duration-300 mb-3 pb-7",
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Image container with zoom effect */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image 
              src={imageSrc} 
              alt={title}
              fill
              className={cn(
                "object-cover transition-transform duration-700",
                isHovered ? "scale-110" : "scale-100"
              )}
            />

            {/* Live tag */}
            {auction.status === 'ongoing' ? (
              <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-light px-3 py-1 z-10 rounded-lg">
                Live
              </div>
            ) : (
              <div className="absolute top-3 left-3 bg-gray-600 text-white text-xs font-light px-3 py-1 z-10 rounded-lg">
                Ended
              </div>
            )}

            {/* Favorite button */}
            <AnimatePresence>
              {isHovered && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleFavoriteClick}
                  className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-2 rounded-full z-10"
                >
                  {isFavorite ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Content with glass background effect */}
          <div className="p-6 pb-0 relative z-10">
            <h3 className="text-white text-2xl font-bold mb-2">{(auction.item_name).toUpperCase()}</h3>
            
          {/* Bidding starts / Current Bid Label */}
          <div className={`text-gray-400 text-xs mb-1 font-medium ${isEnded ? "opacity-0" : ""}`}>
            {!auction.highest_bid ? (
              <span className="text-gray-300">Bidding starts at:</span>
            ) : (
              <span className="text-gray-300">Current bid:</span>
            )}
          </div>

          {/* Price and Time - better spacing */}
          <div className="flex items-center justify-between mb-3 animate-fadeIn min-h-[60px]"> 
            {/* Price - only show if auction is not ended */}
            {!isEnded && (
              <div className="text-white font-extrabold text-xl sm:text-lg md:text-2xl transition-all duration-300 tracking-wide shadow-lg bg-gradient-to-r from-orange-400 to-yellow-500 p-2 rounded-lg">
                {!auction.highest_bid ? (
                  `$${auction.starting_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                ) : (
                  `$${highestBid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                )}
              </div>
            )}

            {/* Countdown / Auction Status */}
            <div className="text-white text-xs sm:text-sm font-medium space-x-1">
              {isEnded ? (
                winner ? (
                  <span className="text-green-400 font-bold animate-pulse">🎉 {winner} won the Auction!</span>
                ) : (
                  <span className="text-red-400 font-semibold">❌ Auction expired</span>
                )
              ) : (
                <Countdown endTime={auction.end_time} onComplete={() => setIsEnded(true)} />
              )}
            </div>
          </div>

          <style jsx>{`
            .animate-fadeIn {
              animation: fadeIn 1s ease-in-out;
            }

            @keyframes fadeIn {
              0% {
                opacity: 0;
              }
              100% {
                opacity: 1;
              }
            }
          `}</style>

            {/* Seller and bid button - with orange border button */}
            <div className="flex items-center justify-between">
              {auctionCreator && (
                <div className="flex items-center text-white text-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {auctionCreator}
                </div>
              )}

            {/* Bid Area with smooth transition */}
            <div className="relative h-12 w-[160px] transition-all duration-500">
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728" />
                  </svg>
                  <span className="text-sm">Login to bid</span>
                </Button>
              ) : (
                <div className="relative w-full h-full">
                  {/* Bid Now Button (animated out when bidding) */}
                  <button
                    onClick={() => setIsBidding(true)}
                    disabled={isEnded}
                    className={`absolute inset-0 w-full h-full flex items-center justify-center rounded-md border font-medium text-white backdrop-blur-sm transition-all duration-500 ease-in-out
                      ${isBidding
                        ? "opacity-0 translate-x-4 scale-95 blur-sm pointer-events-none"
                        : isEnded
                          ? "opacity-60 cursor-not-allowed border-gray-700 bg-gray-900 text-gray-500"
                          : "opacity-100 translate-x-0 scale-100 border-gray-600 bg-gray-800 hover:bg-gray-700"}
                    `}
                  >
                    Bid Now
                  </button>

                  {/* Bid Form (animated in when bidding) */}
                  <form
                    onSubmit={handleBidSubmit}
                    className={`absolute inset-0 w-full h-full flex items-center justify-center gap-2 transition-all duration-500 ease-in-out
                      ${isBidding
                        ? "opacity-100 translate-x-0 scale-100 blur-none"
                        : "opacity-0 -translate-x-4 scale-95 blur-sm pointer-events-none"}
                    `}
                  >
                    <input
                      type="number"
                      name="amount"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      min={(auction.starting_price === auction.highest_bid)
                        ? auction.starting_price
                        : Math.max(auction.starting_price, auction.highest_bid) + 1}
                      placeholder="Your bid"
                      className="w-2/3 max-w-[100px] p-2 rounded-lg border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 transition"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-gray-800 text-white font-semibold rounded-lg border border-gray-700 shadow hover:bg-gray-700 hover:border-gray-500 transition-all duration-300 ease-in-out"
                    >
                      Bid
                    </button>
                  </form>
                </div>
              )}
            </div>


          </div>
        </div>
      </motion.div>

    </>
  );
};

export default AuctionCard;
