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
import { cardBase, cardImageContainer, cardImage, cardOverlay, cardStatusBadge, cardFavoriteBadge, cardContent, cardTitle, cardLabel, cardPrice, cardCountdown, cardFooter, cardCreatorBadge, cardBidButton, getCardAccent } from "./auction-detail/CardStyleSystem";
import PayNowModal from "./PayNowModal";

const FALLBACK_IMAGE = "/fallback.jpg";

interface AuctionCardProps {
  auction: Auction;
  auctionCreator: string;
  isFavourited: boolean;
  user: User;
  loggedIn: boolean;
  token: string;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, auctionCreator, isFavourited, user, loggedIn, token })  => {
  const [winner, setWinner] = useState(null);
  const [ userMoney, setUserMoney] = useState(user?.money);
  const [ participants, setParticipants ] = useState(auction.participants);
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
  const [showPayNowModal, setShowPayNowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [shake, setShake] = useState(false);

  const imageSrc = auction.images?.[0]?.trim() ? auction.images[0] : FALLBACK_IMAGE;
  const accent = getCardAccent("classic");

  // get highest bidder
  useEffect(() => {
    const getHighestBidder = async () => {
      const userId = auction?.highest_bidder_id;

      if (!userId) {
        //console.log("Missing highest_bidder_id");
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

      if (bidAmount > userMoney) {
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
      //setParticipants(prev => prev + 1);
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
    const updateStatus = () => {
      const now = new Date();
      if (now < new Date(auction.start_time)) {
        setCurrentStatus("upcoming");
      } else if (now <= new Date(auction.end_time)) {
        setCurrentStatus("live");
      } else {
        setCurrentStatus("ended");
      }
    };

    updateStatus();

    const interval = setInterval(updateStatus, 60000);

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

  const updateStatus = async () => {
    try {
      const res = await fetch("https://asyncawait-auction-project.onrender.com/api/auctions/updatestatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auction_id: auction.auction_id,
          status: "ended",
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to update status:", error.message);
      } else {
        console.log("Auction status successfully updated to 'ended'");
        setIsEnded(true);
        setCurrentStatus("ended");
      }
    } catch (error) {
      console.error("Error updating auction status:", error);
    }
  }

  const handleWalletPayment = async () => {
    try {
      const res = await fetch("https://asyncawait-auction-project.onrender.com/api/auctions/paywallet", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.user_id,
          amount: auction.highest_bid,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Payment failed:", data.message);
        toast.error(data.message || "Payment failed");
        return;
      }

      toast.success("Payment successful!");
      setShowPayNowModal(false);
      // Optionally refresh balance or trigger other updates:
      setRefresh(prev => !prev);

    } catch (error) {
      console.error("Error during wallet payment:", error);
      toast.error("An unexpected error occurred");
    }
  };

  function handleSSLCOMMERZPayment(): void {
    throw new Error("Function not implemented.");
  }

  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{
      scale: 1.02,
      boxShadow: "0 0 8px 2px rgba(0, 255, 170, 0.5)",
      transition: { duration: 0.35, ease: "easeOut" },
    }}
    className={`${cardBase} bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 backdrop-blur-xl border-2 border-green-300 rounded-2xl shadow-inner shadow-emerald-900/20 transition-all duration-300`}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={handleMouseLeave}
  >
    {/* Image */}
    <div className={cardImageContainer}>
      <div className="relative w-full h-full overflow-hidden group rounded-t-2xl cursor-pointer">
      <Image
        src={imageSrc}
        alt={auction.item_name}
        fill
        onClick={() => setDetailsOpen(true)}
        className={`${cardImage} object-cover transform transition-transform duration-500 group-hover:scale-105`}
      />
    </div>
      <div className={cardStatusBadge}>
        <StatusBadge type="classic" status={currentStatus} auctionId={auction.auction_id} participantCount={participants} />
      </div>
      <div className={cardFavoriteBadge}>
        <FavoriteBadge userId={user?.user_id} auctionId={auction.auction_id} initialFavorited={isFavourited} isHovered={isHovered} />
      </div>
    </div>

    {/* Content */}
    <div className={cardContent} >
      <div onClick={() => setDetailsOpen(true)}>
        <h3 className={`${cardTitle} text-emerald-300`}>#{auction.item_name}</h3>
        <div className={cardLabel}>
          {!highestBid ? (
            <span className="flex items-center gap-1 text-emerald-400"><FaBullhorn /> Bidding starts at:</span>
          ) : (
            <span className="flex items-center gap-1 text-green-300"><FaGavel /> Current bid:</span>
          )}
        </div>
        <div className={`${cardPrice} inline-block text-white text-lg font-bold px-3 py-1 rounded shadow-inner ring-1 ring-green-500/20`}>
          {highestBid ? `$${highestBid.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `$${auction.starting_price.toFixed(2)}`}
        </div>
      </div>

      <div onClick={() => setDetailsOpen(true)} className={`${cardFooter} mt-[-0.03rem] flex items-center justify-between text-green-300`}>
        <div className={cardCountdown}>
          {isEnded
            ? winner
              ? <span className="text-green-400 font-bold animate-pulse">🎉 {winner} won!</span>
              : <span className="text-red-400 font-semibold">❌ Expired</span>
            : <Countdown 
                endTime={auction.end_time} 
                onComplete={updateStatus} 
              />}
        </div>
        { auctionCreator && 
          <div className="text-emerald-400 text-xs md:text-sm cursor-pointer">
            👤 {auctionCreator}
          </div>
        }
      </div>

      {/* Bid Section */}
      <div className="w-full mt-2 relative">
        {!loggedIn ? (
          <Button disabled className="w-full flex items-center justify-center gap-2 rounded-full bg-gray-800 border border-gray-700 text-gray-400 opacity-60 cursor-not-allowed shadow-inner ring-1 ring-inset ring-gray-600/30 font-semibold text-base md:text-lg">Login to bid</Button>
        ) : (
          (!isEnded ? 
            (
              <div className="w-full">
                {auction?.user_id !== user?.user_id ? (
                  <>
                    <motion.button
                      onClick={() => {
                        setIsBidding(true);
                        setShake(true);
                        setTimeout(() => setShake(false), 600);
                      }}
                      disabled={auction.status === "upcoming"}
                      className={`
                        w-full py-2 px-4 font-semibold rounded-full text-white
                        transition-all duration-500 ease-in-out
                        bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 shadow-md
                        cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                        ${isBidding ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto'}
                      `}
                    >
                      {auction.status === "upcoming" ? "Coming soon" : "Place Bid"}
                    </motion.button>
                    <form
                      onSubmit={handleBidSubmit}
                      className={`absolute left-0 right-0 top-0 w-full flex items-center justify-center gap-2 transition-all duration-500 ease-in-out z-10 ${
                        isBidding
                          ? "opacity-100 translate-x-0 scale-100 blur-none pointer-events-auto"
                          : "opacity-0 -translate-x-4 scale-95 blur-sm pointer-events-none"
                      }`}
                      style={{ minHeight: '44px' }}
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
                        className="w-2/3 max-w-[100px] p-2 rounded-lg border bg-emerald-950 text-white border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400 transition"
                      />
                      <button
                        type="submit"
                        disabled={submittingBid}
                        className={`px-3 py-2 bg-emerald-700 text-white font-semibold rounded-lg border border-emerald-600 shadow hover:bg-emerald-600 hover:border-emerald-500 transition-all duration-300 ease-in-out cursor-pointer ${
                          submittingBid ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Bid
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="w-full py-2 px-4 font-semibold rounded-full text-white border border-gray-500 shadow-md flex items-center justify-center rounded-full border border-gray-500 bg-gray-800 text-gray-300 font-medium cursor-not-allowed shadow-inner text-xs md:text-sm">You created this auction</div>
                )}
              </div>
              ):(
              <div className="w-full">
                  <motion.button
                    onClick={() => setShowPayNowModal(true)}
                    className={`
                      w-full py-2 px-4 font-semibold rounded-full text-white
                      transition-all duration-500 ease-in-out
                      bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 shadow-md
                      cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                    `}
                  >
                    Pay Now
                  </motion.button>
              </div>
            )) 
        )}
      </div>


    </div>

    <AuctionDetailsModal open={detailsOpen} onClose={() => setDetailsOpen(false)} auction={auction} />
    <PayNowModal
      open={showPayNowModal}
      onClose={() => setShowPayNowModal(false)}
      onWalletPay={handleWalletPayment}
      onSSLCOMMERZPay={handleSSLCOMMERZPayment}
      userBalance={user?.money}
      amount={auction?.highest_bid}
    />
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
