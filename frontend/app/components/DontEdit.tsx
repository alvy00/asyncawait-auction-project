/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import Image from "next/image";
import toast from "react-hot-toast";
import { Auction } from "../../lib/interfaces";
import { Countdown } from "./Countdown";

const FALLBACK_IMAGE = "/fallback.jpg";


const AuctionCard = ({ auction, auctionCreator }: { auction: Auction; auctionCreator: string }) => {
  const [winner, setWinner] = useState(null);
  const [isEnded, setIsEnded] = useState(false);
  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
  const [highestBid, setHighestBid] = useState(auction.highest_bid);

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
  };

  return (
    <div
      className="bg-[#1a1f2a] rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 hover:shadow-lg"
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-48 w-full">
        <Image
          src={imageSrc}
          alt={auction.item_name}
          width={400}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1">{auction.item_name}</h3>
        <p className="text-sm text-gray-400 mb-2 capitalize">
          {auction.category} • {auction.condition}
        </p>

        {!auction.highest_bid ? (
          <p className="text-lg font-medium text-gray-300 mb-2">
            <span className="text-orange-500 font-bold text-xl">
              Bidding Kicks Off at <span className="text-white">${auction.starting_price.toLocaleString()}</span>
            </span>
          </p>
        ) : (
          <span className="text-base font-medium text-gray-300 mb-2">
            <span
              className="text-orange-500 font-semibold text-xl transition-all duration-500 ease-in-out
                        animate-pulse
                        hover:scale-105 hover:text-orange-400"
            >
              {isEnded ? (
                <span>
                  {winner ? (
                    <span>{winner} won the Auction!</span>
                  ) : (
                    <span>Auction expired</span>
                  )}
                </span>
              ) : (
                <span>
                  Current Bid: <span className="text-white">${highestBid}</span>
                </span>
              )}
            </span>
          </span>

        )}
        
        <div className="text-sm text-gray-600 flex justify-between items-center mb-3">
          <Countdown endTime={auction.end_time} onComplete={() => setIsEnded(true)} />
          <span className={`capitalize font-medium ${isEnded ? "text-red-500" : "text-green-600"}`}>
            {auction.status.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center text-gray-400 text-xs mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {auctionCreator}
        </div>

        {/* Bid Area with smooth transition */}
        <div className="transition-all duration-500">
          {!token ? (
            <Button
              disabled
              className="w-full bg-gray-800 border border-gray-700 opacity-70 cursor-not-allowed text-white"
            >
              Login to bid
            </Button>
          ) : (
            <div className="relative h-12 transition-all duration-500 group">
              
        {/* Bid Now Button */}
        <button
          onClick={() => setIsBidding(true)}
          disabled={isEnded}
          className={`absolute inset-0 w-full h-full flex items-center justify-center rounded-md border font-medium text-white backdrop-blur-sm transition-all duration-500 ease-in-out
            ${isBidding
              ? "opacity-0 translate-x-5 scale-95 blur-sm pointer-events-none"
              : isEnded
                ? "opacity-60 cursor-not-allowed border-gray-700 bg-gray-900 text-gray-500"
                : "opacity-100 translate-x-0 scale-100 border-gray-600 bg-gray-800 hover:bg-gray-700"}
          `}
        >
          Bid Now
        </button>

        {/* Bid Form */}
        <form
          onSubmit={handleBidSubmit}
          className={`absolute inset-0 w-full h-full flex items-center justify-center gap-5 transition-all duration-500 ease-in-out
            ${isBidding ? "opacity-100 translate-x-0 scale-100 blur-none" : "opacity-0 -translate-x-5 scale-95 blur-sm pointer-events-none"}
          `}
        >
          <input
            type="number"
            name="amount"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            min={(auction.starting_price===auction.highest_bid)? auction.starting_price:Math.max(auction.starting_price, auction.highest_bid)+1}
            placeholder="Your bid"
            className="w-2/3 max-w-[160px] p-2 rounded-lg border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 transition"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 text-white font-semibold tracking-wide rounded-lg border border-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.25)] 
                      hover:bg-gray-700 hover:border-gray-500 hover:shadow-[0_3px_12px_rgba(0,0,0,0.35)] 
                      focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 
                      active:scale-95 transition-all duration-300 ease-in-out"
          >
            Bid
          </button>
        </form>
      </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
