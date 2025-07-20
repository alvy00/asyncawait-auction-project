/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaBolt, FaBullhorn, FaHourglassHalf, FaStar, FaStopwatch } from "react-icons/fa";
import { Auction, User } from "../../lib/interfaces";
import Image from "next/image";
import { Countdown } from "./Countdown";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";
import FavoriteBadge from "./FavouriteBadge";
import StatusBadge from "./StatusBadge";
import AuctionDetailsModal from "./AuctionDetailsModal";
import { cardBase, cardImageContainer, cardImage, cardOverlay, cardStatusBadge, cardFavoriteBadge, cardContent, cardTitle, cardLabel, cardPrice, cardCountdown, cardFooter, cardCreatorBadge, cardBidButton, getCardAccent } from "./auction-detail/CardStyleSystem";

interface AuctionCardProps {
  auction: Auction;
  auctionCreator: string;
  user: User;
}

const FIREY_ORANGE = "#FF4500";

const AuctionCardBlitz: React.FC<AuctionCardProps> = ({ auction, auctionCreator, user }) => {
  const controls = useAnimation();
  const [winner, setWinner] = useState(null);
  const [ participants, setParticipants ] = useState(auction?.participants);
  const [isBidding, setIsBidding] = useState(false);
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bidAmount, setBidAmount] = useState(
    auction.highest_bid ? auction.highest_bid + 1 : auction.starting_price
  );
  const [highestBid, setHighestBid] = useState(auction.highest_bid);
  const [isHovered, setIsHovered] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [shake, setShake] = useState(false);

  const imageSrc = auction.images?.[0]?.trim() ? auction.images[0] : "/fallback.jpg";
  const token =typeof window !== "undefined"? localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken") : null;
  const accent = getCardAccent("blitz");

  // fetch user
  // useEffect(() => {
  //   const getUser = async () => {
  //     const token =
  //       localStorage.getItem("sessionToken") ||
  //       sessionStorage.getItem("sessionToken");
  //     if (!token) {
  //       console.warn("No token found");
  //       return;
  //     }

  //     try {
  //       const res = await fetch(
  //         "https://asyncawait-auction-project.onrender.com/api/getuser",
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       if (!res.ok) {
  //         const err = await res.json();
  //         console.error("Failed to fetch user:", err.message);
  //         return;
  //       }

  //       const data = await res.json();
  //       setUser(data);
  //     } catch (e) {
  //       console.error("Error fetching user:", e);
  //     }
  //   };
  //   getUser();
  // }, []);

  // submit bid
  const handleBidSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittingBid(true);

    try {
      const formData = new FormData(e.currentTarget);

      const body = {
        auction_id: auction.auction_id,
        amount: formData.get("amount"),
      };

      const res = await fetch(
        "https://asyncawait-auction-project.onrender.com/api/auctions/bid",
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
        console.error("Error placing bid:", error);
        toast.error(error?.message || "Failed to place bid.");
        return;
      }

      toast.success(`Bid of $${bidAmount} placed successfully!`);
      setHighestBid(Number(bidAmount));
      setIsBidding(false);
      setRefresh(prev => !prev);
    } catch (err) {
      console.error("Bid submission error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmittingBid(false);
    }
  };

  // get highest bidder
  useEffect(() => {
    const getHighestBidder = async () => {
      const userId = auction?.highest_bidder_id;

      if (!userId) {
        console.log("Missing highest_bidder_id");
        return;
      }

      try {
        const res = await fetch(
          "https://asyncawait-auction-project.onrender.com/api/fetchuser",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: userId }),
          }
        );

        if (!res.ok) {
          const errorBody = await res.text();
          console.error(
            "Failed to fetch user. Status:",
            res.status,
            "Response:",
            errorBody
          );
          return;
        }

        const data = await res.json();
        setWinner(data.name);
        return data;
      } catch (err) {
        console.error("Fetch exception:", err);
      }
    };

    getHighestBidder();
  }, [auction?.highest_bidder_id, refresh]);

  // Status Badge component
  // const StatusBadge = ({ status, auctionId }) => {
  //   useEffect(() => {
  //     if (status.toLowerCase() === "ended") {
  //       const updateStatusEnd = async () => {
  //         try {
  //           const res = await fetch('https://asyncawait-auction-project.onrender.com/api/auctions/updatestatus', {
  //             method: 'POST',
  //             headers: { 'Content-Type': 'application/json' },
  //             body: JSON.stringify({ auctionId, status: "ended" }),
  //           });

  //           if (res.ok) {
  //             const json = await res.json();
  //             console.log(json.message);
  //           } else {
  //             console.error("Failed to update auction status", res.status);
  //           }
  //         } catch (error) {
  //           console.error("Error updating auction status:", error);
  //         }
  //       };

  //       updateStatusEnd();
  //     }
  //   }, [status, auctionId]);

  //   let bgClasses = "";
  //   let text = "";
  //   let Icon = null;

  //   return (
  //     <motion.div
  //       animate={status.toLowerCase() === "live" ? controls : { scale: 1 }}
  //       className={`${bgClasses} text-white text-xs font-bold px-4 py-1 z-10 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm absolute top-4 left-4`}
  //     >
  //       {Icon && <Icon className="text-white" />}
  //       <span>{text}</span>
  //     </motion.div>
  //   );
  // };

  // Live Badge Animation
  useEffect(() => {
    if (auction.status === "live") {
      controls.start({
        scale: [1, 1.05, 1],
        opacity: [1, 0.75, 1],
        transition: {
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        },
      });
    } else {
      controls.stop();
      controls.set({ scale: 1, boxShadow: "none" });
    }
  }, [auction.status, controls, refresh]);

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
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => {
      setIsHovered(false);
      setIsBidding(false);
    }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{
      scale: 1.02,
      boxShadow: "0 0 8px 2px rgba(255, 85, 0, 0.5)",
      transition: { duration: 0.35, ease: "easeOut" },
    }}
    className={`${cardBase} relative rounded-2xl bg-[rgba(30,10,5,0.3)] backdrop-blur-md border border-orange-700 shadow-lg bg-gradient-to-br from-[#3a0c00]/40 via-[#5b1900]/25 to-[#3a0c00]/40 text-white`}
  >
    {/* Image container */}
    <div className={`${cardImageContainer} cursor-pointer rounded-t-2xl overflow-hidden`}>
      <Image
        src={imageSrc}
        alt={auction.item_name}
        fill
        className={`object-cover ${cardImage}`}
        priority
        onClick={() => setDetailsOpen(true)}
      />
      <div className={cardStatusBadge}>
        <StatusBadge type="blitz" status={auction.status} auctionId={auction.auction_id} participantCount={participants} />
      </div>
      <div className={cardFavoriteBadge}>
        <FavoriteBadge userId={user?.user_id} auctionId={auction.auction_id} initialFavorited={auction.isFavorite} isHovered={isHovered} />
      </div>
    </div>

    {/* Content area */}
    <div className={`${cardContent}`}>
      <div onClick={() => setDetailsOpen(true)}>
        <h3 className={`${cardTitle} text-orange-300 cursor-pointer`}>#{auction.item_name}</h3>
        <div className={`${cardLabel} flex items-center gap-1 text-orange-300`}>
          {!highestBid ? (
            <>
              <FaBullhorn className="text-yellow-400" />
              Start the Bidding war at:
            </>
          ) : (
            <>Current Highest bid:</>
          )}
        </div>
        <div className={`${cardPrice} inline-block text-white text-lg font-bold px-3 py-1 rounded shadow-inner ring-1 ring-red-500/20`}>
          {highestBid
            ? `$${highestBid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : `$${auction.starting_price.toFixed(2)}`}
        </div>

        <div className={cardFooter + " flex items-center justify-between"}>
          <div className={cardCountdown}>
            <Countdown endTime={auction.end_time} />
          </div>
          <div className={`${cardCreatorBadge} text-orange-400 font-semibold flex items-center`}>
            {auctionCreator}
          </div>
        </div>
      </div>

      {/* Bid Now Area with Transition */}
      <div className="w-full mt-2 relative">
        {!token ? (
          <Button
            disabled
            className="w-full flex items-center justify-center gap-2 rounded-full bg-gray-900 border border-gray-700 text-gray-500 opacity-60 cursor-not-allowed shadow-inner ring-1 ring-inset ring-gray-700/50"
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
          <div className="w-full relative">
              <div className={`w-full ${shake ? "animate-shake" : ""} relative`}>
                {/* Bid Now Button */}
                <div
                  className={`w-full flex items-center justify-center transition-all duration-500 ease-in-out z-10 ${
                    isBidding ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100 pointer-events-auto"
                  }`}
                >
                  {auction?.user_id !== user?.user_id ? (
                    <button
                      onClick={() => {
                        setIsBidding(true);
                        setShake(true);
                        setTimeout(() => setShake(false), 600);
                      }}
                      disabled={auction.status === "upcoming"}
                      type="button"
                      className={`
                        w-full py-2 px-4 rounded-full
                        bg-gradient-to-r from-orange-600 to-orange-800
                        border border-orange-700 text-white font-bold shadow-lg
                        hover:from-orange-700 hover:to-orange-900 hover:border-orange-600
                        transition duration-300
                        cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                      `}
                    >
                      {auction.status === "upcoming" ? "Coming Soon" : "Place Bid"}
                    </button>
                  ) : (
                    <div className="w-full flex items-center justify-center rounded-full border border-gray-600 bg-gray-900 text-gray-400 font-medium cursor-not-allowed shadow-inner text-sm">
                      You created this auction
                    </div>
                  )}
                </div>

                {/* Bid Form (slide/scale/blur animated transition) */}
                <form
                  onSubmit={handleBidSubmit}
                  className={`absolute left-0 right-0 top-0 w-full h-full flex items-center justify-center gap-2 transition-all duration-500 ease-in-out z-0 ${
                    isBidding
                      ? "opacity-100 translate-x-0 scale-100 blur-none pointer-events-auto"
                      : "opacity-0 -translate-x-4 scale-95 blur-sm pointer-events-none"
                  }`}
                  style={{ minHeight: "44px" }}
                >
                  <input
                    type="number"
                    name="amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    min={auction.starting_price}
                    placeholder="Your bid"
                    className="w-2/3 max-w-[100px] p-2 rounded-lg border border-orange-700 bg-[rgba(255, 69, 0, 0.15)] text-white placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={submittingBid}
                    className={`px-3 py-2 bg-orange-700 text-white font-semibold rounded-lg border border-orange-600 shadow hover:bg-orange-600 hover:border-orange-500 transition-all duration-300 ease-in-out cursor-pointer ${
                      submittingBid ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Bid
                  </button>
                </form>
              </div>
          </div>
        )}
      </div>
    </div>

    {/* Overlay during bidding */}
    {submittingBid && (
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xl font-bold text-white z-50 pointer-events-auto space-x-4 rounded-2xl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-white border-t-transparent rounded-full"
        />
        <span>Submitting Bid...</span>
      </div>
    )}

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

export default AuctionCardBlitz;
