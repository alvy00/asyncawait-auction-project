/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaArrowDown, FaClock, FaBan } from "react-icons/fa";
import { Auction } from "../../lib/interfaces";
import Image from "next/image";
import { Countdown } from "./Countdown";
import toast from "react-hot-toast";

interface AuctionCardProps {
  auction: Auction;
}

const FIREY_PURPLE = "rgba(191, 85, 236, "; // vibrant purple (rgba base)

const AuctionCardReverse: React.FC<AuctionCardProps> = ({ auction }) => {
  const controls = useAnimation();
  const [isBidding, setIsBidding] = useState(false);
  const [winner, setWinner] = useState(null);
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bidAmount, setBidAmount] = useState(
    auction.highest_bid ? auction.highest_bid - 2 : auction.starting_price
  );
  const [highestBid, setHighestBid] = useState(auction.highest_bid);
  const [user, setUser] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [shake, setShake] = useState(false);


  const FALLBACK_IMAGE = "/fallback.jpg";
  const token = typeof window !== "undefined"? localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken") : null;
  
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

      const amount = parseFloat(formData.get("amount") as string);

      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid bid amount.");
        return;
      }

      const body = {
        auction_id: auction.auction_id,
        amount,
      };

      const res = await fetch(
        "https://asyncawait-auction-project.onrender.com/api/auctions/bidlow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        console.error("Error placing bid:", result);
        toast.error(result?.message || "Failed to place bid.");
        return;
      }

      toast.success(`Bid of $${amount.toFixed(2)} placed successfully!`);
      setHighestBid(amount);
      setBidAmount(amount);
      setIsBidding(false);
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
  }, [auction?.highest_bidder_id]);

  // Status Badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let bgClasses = "";
    let text = "";
    let Icon = null;

    switch (status.toLowerCase()) {
      case "live":
        bgClasses = "bg-gradient-to-r from-purple-700 to-purple-600";
        text = "REVERSE LIVE";
        Icon = FaArrowDown;
        break;
      case "upcoming":
        bgClasses = "bg-gradient-to-r from-yellow-600 to-yellow-500";
        text = "REVERSE UPCOMING";
        Icon = FaClock;
        break;
      case "ended":
        bgClasses = "bg-gradient-to-r from-gray-700 to-gray-600";
        text = "REVERSE ENDED";
        Icon = FaBan;
        break;
      default:
        return null;
    }

    return (
      <motion.div
        animate={status.toLowerCase() === "live" ? controls : { scale: 1 }}
        className={`${bgClasses} text-white text-xs font-bold px-4 py-1 z-10 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm absolute top-4 left-4`}
      >
        {Icon && <Icon className="text-white animate-pulse" />}
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
  }, [auction.status, controls]);

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
        scale: 1.03,
        boxShadow: `0 0 30px 10px ${FIREY_PURPLE}0.7)`,
        transition: { duration: 0.3 },
      }}
      className={`relative w-full h-[500px] group rounded-lg overflow-hidden bg-gradient-to-br from-purple-900 to-purple-800 text-white border border-white/20 select-none flex flex-col`}
    >
      {/* Image container with fixed height */}
      <div className="relative h-72 w-full rounded-t-lg overflow-hidden">
        <Image
          src={FALLBACK_IMAGE}
          alt={auction.item_name || "Reverse Auction"}
          fill
          sizes="(max-width: 768px) 100vw, 700px"
          className="brightness-90 group-hover:brightness-110 transition duration-300 object-cover"
          priority
        />
      </div>

      <StatusBadge status={auction.status} />

      {/* Info section fills remaining space */}
      <div className="p-5 flex flex-col justify-between flex-grow bg-gradient-to-t from-black/80 to-transparent relative">
        <div>
          <h3 className="text-2xl font-bold">{auction.item_name}</h3>
          <p className="mt-2 text-lg">
            Lowest Bid:{" "}
            <span className="font-extrabold text-purple-300">
              ${highestBid?.toFixed(2) ?? "—"}
            </span>
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-orange-400">
            <span className="text-white bg-white/5 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10 font-mono tracking-wide">
              <Countdown endTime={auction.end_time} />
            </span>
          </div>
        </div>

      {/* Bid Now Area with Transition */}
      <div className="absolute bottom-5 right-5 z-10">
        <div className="relative h-12 w-[160px] transition-all duration-500">
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
                    setTimeout(() => setShake(false), 600);
                  }}
                  className="w-full h-full flex items-center justify-center rounded-md border border-orange-700 bg-orange-800 hover:bg-orange-700 font-medium text-white backdrop-blur-sm transition-all duration-300 ease-in-out cursor-pointer"
                  type="button"
                >
                  Place Lower Bid
                </button>
              </div>

              {/* Bid Form (slide/scale/blur animated transition) */}
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
                  max={
                    auction.highest_bid
                      ? auction.highest_bid - 1
                      : auction.starting_price - 1
                  }
                  min={0}
                  placeholder="Your lower bid"
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

      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.6s ease-in-out;
          }
        `}
      </style>
    </motion.div>
  );
};

export default AuctionCardReverse;
