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
import StatusBadge from "./StatusBadge";
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

const FALLBACK_IMAGE = "/fallback.jpg";

interface AuctionCardProps {
  auction: Auction;
  auctionCreator: string;
  isFavourited: boolean;
  user: User;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, auctionCreator, isFavourited, user })  => {
  const [winner, setWinner] = useState(null);
  const [isEnded, setIsEnded] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isBidding, setIsBidding] = useState(false);
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
  const [highestBid, setHighestBid] = useState(auction.highest_bid);
  const [isHovered, setIsHovered] = useState(false);
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
  const accent = getCardAccent("classic");

  // fetch user
  // useEffect(() => {
  //   const getUser = async () => {
  //     const token = localStorage.getItem('sessionToken') || sessionStorage.getItem('sessionToken');
  //     if (!token) {
  //       console.warn('No token found');
  //       return;
  //     }

  //     try {
  //       const res = await fetch('https://asyncawait-auction-project.onrender.com/api/getuser', {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`,
  //         },
  //       });

  //       if (!res.ok) {
  //         const err = await res.json();
  //         console.error('Failed to fetch user:', err.message);
  //         return;
  //       }

  //       const data = await res.json();
  //       setUser(data);
  //     } catch (e) {
  //       console.error('Error fetching user:', e);
  //     }
  //   };
  //   getUser();
  // }, []);

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
      whileHover={{
        scale: 1.02,
        boxShadow: "0 4px 32px 0 rgba(16,30,54,0.18)",
        transition: { duration: 0.35, ease: "easeOut" },
      }}
      className={`${cardBase} bg-gradient-to-br ${accent.bg}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image */}
      <div className={cardImageContainer}>
        <Image
          src={imageSrc}
          alt={auction.item_name}
          fill
          onClick={() => setDetailsOpen(true)}
          className={cardImage}
        />
        <div className={cardOverlay}></div>
        {/* Status badge */}
        <div className={cardStatusBadge}>
          <StatusBadge type="classic" status={currentStatus} auctionId={auction.auction_id} participantCount={auction.participants}     />
        </div>
        {/* Favorite badge */}
        <div className={cardFavoriteBadge}>
          <FavoriteBadge userId={user?.user_id} auctionId={auction.auction_id} initialFavorited={isFavourited} isHovered={isHovered} />
        </div>
      </div>
      {/* Content */}
      <div className={cardContent}>
        <div onClick={() => setDetailsOpen(true)}>
          <h3 className={cardTitle}>#{auction.item_name}</h3>
          <div className={cardLabel}>
            {!highestBid ? (
              <span className="flex items-center gap-1"><FaBullhorn className="text-yellow-400" />Bidding starts at:</span>
            ) : (
              <span className="flex items-center gap-1"><FaGavel className="text-orange-400" />Current bid:</span>
            )}
          </div>
          <div className={`${cardPrice} bg-gradient-to-r ${accent.price}`}>
            {highestBid ? `$${highestBid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `$${auction.starting_price.toFixed(2)}`}
            {/* {highestBid && winner && <div className="text-xs md:text-sm font-medium text-white/80 mt-1">by {winner}</div>} */}
          </div>
        </div>
        <div className={cardFooter}>
          <div className={cardCountdown}>
            {isEnded ? (winner ? <span className="text-green-400 font-bold animate-pulse">🎉 {winner} won!</span> : <span className="text-red-400 font-semibold">❌ Expired</span>) : <Countdown endTime={auction.end_time} onComplete={() => setIsEnded(true)} />}
          </div>
          {auctionCreator && <div className={cardCreatorBadge}><span className="mr-2">👤</span>{auctionCreator}</div>}
        </div>
        {/* Bid button / form */}
        <div className="w-full mt-2">
          {!token ? (
            <Button disabled className="w-full flex items-center justify-center gap-2 rounded-full bg-gray-800 border border-gray-700 text-gray-400 opacity-60 cursor-not-allowed shadow-inner ring-1 ring-inset ring-gray-600/30 font-semibold text-base md:text-lg">Login to bid</Button>
          ) : (!isEnded && <div className="w-full">
            {auction?.user_id !== user?.user_id ? (
              <button onClick={() => { setIsBidding(true); setShake(true); setTimeout(() => setShake(false), 600); }} type="button" className={`${cardBidButton} ${accent.border}`}>Place Bid</button>
            ) : (
              <div className="w-full flex items-center justify-center rounded-full border border-gray-500 bg-gray-800 text-gray-300 font-medium cursor-not-allowed shadow-inner text-xs md:text-sm">You created this auction</div>
            )}
          </div>)}
        </div>
      </div>
      {/* Auction details Modal */}
      <AuctionDetailsModal open={detailsOpen} onClose={() => setDetailsOpen(false)} auction={auction} />
      {/* Shake animation */}
      <style>{`
        @keyframes gentle-shake { 0%, 100% { transform: translateX(0); } 30% { transform: translateX(-0.3px); } 50% { transform: translateX(0.3px); } 70% { transform: translateX(-0.2px); } }
        .animate-shake { animation: gentle-shake 0.4s ease-in-out; }
      `}</style>
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
