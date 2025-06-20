/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaBolt, FaHourglassHalf, FaStar, FaStopwatch } from "react-icons/fa";
import { Auction } from "../../lib/interfaces";
import Image from "next/image";
import { Countdown } from "./Countdown";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";

interface AuctionCardProps {
  auction: Auction;
  auctionCreator: string;
}

const FIREY_ORANGE = "#FF4500"; // Firey Orange (OrangeRed)

const AuctionCardBlitz: React.FC<AuctionCardProps> = ({ auction, auctionCreator }) => {
  const controls = useAnimation();
  const [winner, setWinner] = useState(null);
  const [isBidding, setIsBidding] = useState(false);
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bidAmount, setBidAmount] = useState(
    auction.highest_bid ? auction.highest_bid + 1 : auction.starting_price
  );
  const [highestBid, setHighestBid] = useState(auction.highest_bid);
  const [user, setUser] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [shake, setShake] = useState(false);

  const imageSrc = auction.images?.[0]?.trim() ? auction.images[0] : "/fallback.jpg";
  const token =typeof window !== "undefined"? localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken") : null;

  // fetch user
  useEffect(() => {
    const getUser = async () => {
      const token =
        localStorage.getItem("sessionToken") ||
        sessionStorage.getItem("sessionToken");
      if (!token) {
        console.warn("No token found");
        return;
      }

      try {
        const res = await fetch(
          "https://asyncawait-auction-project.onrender.com/api/getuser",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const err = await res.json();
          console.error("Failed to fetch user:", err.message);
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
  const StatusBadge = ({ status, auctionId }) => {
    useEffect(() => {
      if (status.toLowerCase() === "ended") {
        const updateStatusEnd = async () => {
          try {
            const res = await fetch('https://asyncawait-auction-project.onrender.com/api/auctions/updatestatus', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ auctionId, status: "ended" }),
            });

            if (res.ok) {
              const json = await res.json();
              console.log(json.message);
            } else {
              console.error("Failed to update auction status", res.status);
            }
          } catch (error) {
            console.error("Error updating auction status:", error);
          }
        };

        updateStatusEnd();
      }
    }, [status, auctionId]);

    let bgClasses = "";
    let text = "";
    let Icon = null;

    switch (status.toLowerCase()) {
      case "live":
        bgClasses = "bg-gradient-to-r from-orange-800 to-orange-600";
        text = "BLITZ | LIVE";
        Icon = FaBolt;
        break;
      case "upcoming":
        bgClasses = "bg-gradient-to-r from-yellow-500 to-yellow-400";
        text = "BLITZ | UPCOMING";
        Icon = FaHourglassHalf;
        break;
      case "ended":
        bgClasses = "bg-gradient-to-r from-gray-700 to-gray-600";
        text = "BLITZ | ENDED";
        Icon = FaStopwatch;
        break;
      default:
        return null;
    }

    return (
      <motion.div
        animate={status.toLowerCase() === "live" ? controls : { scale: 1 }}
        className={`${bgClasses} text-white text-xs font-bold px-4 py-1 z-10 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm absolute top-4 left-4`}
      >
        {Icon && <Icon className="text-white" />}
        <span>{text}</span>
      </motion.div>
    );
  };

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
        boxShadow: "0 0 5px 1px rgba(255, 69, 0, 0.45)",
        transition: { duration: 0.35, ease: "easeOut" },
      }}
      className={`relative w-full h-[500px] group rounded-lg overflow-hidden 
        bg-gradient-to-br from-[#4a0d0d] via-[#801111] to-[#a42c2c]
        border border-white/20 text-white select-none`}
    >

      {/* Image container */}
      <div className="relative h-[55%] w-full overflow-hidden group">
        <Image
          src={imageSrc}
          alt={auction.item_name}
          fill
          style={{ objectFit: "cover" }}
          className="brightness-90 group-hover:brightness-110 object-cover transition-transform duration-700 group-hover:scale-110"
          priority
        />
      </div>

      {/* Status Badge */}
      <StatusBadge status={auction.status} auctionId={auction.auction_id}/>

      {/* Content area */}
      <div className="p-5 flex flex-col justify-between h-[45%] bg-gradient-to-t from-black/80 to-transparent">
        <div>
          <h3
            className="text-2xl font-bold tracking-wide uppercase mb-2 
                      text-orange-100 drop-shadow-sm"
          >
            #{auction.item_name}
          </h3>
          <div className="mt-2 text-lg">
            {/* Bidding starts / Current Bid Label */}
            <div className={`text-gray-400 text-xs mb-1 font-medium`}>
            {!highestBid ? (
              <span className="text-yellow-300 text-xl font-medium tracking-wide">Be The First to Bid</span>
            ) : (
              <span className="text-gray-300">Current Highest bid:</span>
              
            )}
            </div>
            {highestBid > 0 && 
              <span className="font-extrabold text-transparent bg-clip-text font-bold text-3xl" style={{ color: FIREY_ORANGE }}>
                ${highestBid.toFixed(2)}
              </span>
            }
            
          </div>

          {/* Higest bid and name */}
          <div
            className="mt-1 text-sm flex items-center gap-2 select-none cursor-pointer
            text-yellow-300 font-semibold tracking-wide
            transition-all duration-300 ease-in-out"
          >
            <div className="text-gray-200">by</div>
            <div className="hover:underline transition-all duration-200">
              {winner || "—"}
            </div>
          </div>

          {/* Countdown */}
          <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-orange-400">
            <span className="text-white bg-white/5 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10 font-mono tracking-wide">
              <Countdown endTime={auction.end_time} />
            </span>
          </div>
        </div>

        {/* Bid Now Area with Transition */}
        <div className="absolute bottom-5 right-5 z-10">
          {!token? (
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
            <div className="relative h-12 w-[160px] transition-all duration-500">
              {/* If auction is live and user is allowed to bid */}
              {auction.status === "live" && (
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
                      }}
                      className="w-full h-full flex items-center justify-center rounded-md border border-orange-700 bg-orange-800 hover:bg-orange-700 font-medium text-white backdrop-blur-sm transition-all duration-300 ease-in-out cursor-pointer"
                    >
                      Place Higher Bid
                    </button>
                  </div>

                  {/* Bid Form (slide/scale/blur animated transition) */}
                  <form
                    onSubmit={handleBidSubmit}
                    className={`absolute inset-0 w-full h-full flex items-center justify-center gap-2 transition-all duration-500 ease-in-out z-0
                      ${isBidding
                        ? "opacity-100 translate-x-0 scale-100 blur-none pointer-events-auto"
                        : "opacity-0 -translate-x-4 scale-95 blur-sm pointer-events-none"}`}
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
                      className="w-2/3 max-w-[100px] p-2 rounded-lg border bg-gray-800 text-white border-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 transition"
                    />
                    <button
                      type="submit"
                      disabled={submittingBid}
                      className={`px-3 py-2 bg-orange-800 text-white font-semibold rounded-lg border border-orange-700 shadow hover:bg-orange-700 hover:border-orange-500 transition-all duration-300 ease-in-out cursor-pointer ${
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

export default AuctionCardBlitz;
