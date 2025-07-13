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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0 5px 1px rgba(0,191,255,0.8)",
        transition: { duration: 0.35, ease: "easeOut" },
      }}
      className={`relative w-full h-[500px] rounded-lg overflow-hidden bg-gradient-to-br from-white-900 to-blue-800 text-white border border-white/20 select-none ${
        shake ? "animate-shake" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Image container with fixed height */}
      <div onClick={() => setDetailsOpen(true)} className="relative h-[55%] w-full overflow-hidden group">
        <Image
          src={imageSrc}
          alt={auction.item_name}
          fill
          style={{ objectFit: "cover" }}
          className="brightness-90 group-hover:brightness-110 object-cover transition-transform duration-700 group-hover:scale-110"
          priority
        />
      </div>
      
      {/* Status and Favorite Badge */}
      <StatusBadge type={"dutch"} status={auction.status} auctionId={auction.auction_id}/>
      <FavoriteBadge userId={user?.user_id} auctionId={auction.auction_id} initialFavorited={auction.isFavorite} isHovered={isHovered} />
      
      {/* Info section */}
      <div className="p-5 h-[45%] flex flex-col justify-between bg-gradient-to-t from-black/80 to-transparent min-h-[150px]">
        <div onClick={() => setDetailsOpen(true)}>
          <h3
            className="text-2xl font-bold tracking-wide uppercase mb-2 text-cyan-100 drop-shadow-sm cursor-pointer"
          >
            #{auction.item_name}
          </h3>
          <p className="mt-2 text-sm flex items-center gap-2">
            <FaTag className="text-cyan-400" />
            Original Price:{" "}
            <span className="font-extrabold text-cyan-200">${auction.starting_price.toFixed(2)}</span>
          </p>

          <p className="mt-2 text-base flex flex-col gap-1">
            <span className="flex items-center gap-2 text-cyan-300 font-semibold">
              <FaArrowDown className="text-cyan-500" />
              Price dropped to:
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500 font-extrabold text-3xl">
              ${currentPrice.toFixed(2)}{" "}
              <span className="text-base text-green-500 font-semibold">
                ({Math.round(((auction.starting_price - currentPrice) / auction.starting_price) * 100)}%)
              </span>
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-orange-400 mt-3">
          <span className="text-white bg-white/5 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10 font-mono tracking-wide">
            <Countdown endTime={auction.end_time} />
          </span>
        </div>
      </div>
      
      {/* AuctionCreator Badge */}
      {auctionCreator && (
        <div className="flex items-center text-white text-sm bg-white/5 backdrop-blur-sm px-2 py-1 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {auctionCreator}
        </div>
      )}

      {auction.status === "live" && !submittingBid && (
        <div className="absolute bottom-5 right-5 z-20 flex flex-col items-end">
          {!token ? (
            <Button
              disabled
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md 
                        bg-gray-800 border border-gray-700 text-gray-400 opacity-60 
                        cursor-not-allowed shadow-inner ring-1 ring-inset ring-gray-600/30"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728" />
              </svg>
              <span className="text-sm">Login to bid</span>
            </Button>
          ) : (
            <>
              {auction?.user_id !== user?.user_id ?
                (
                  <motion.button
                    onClick={handleAcceptClick}
                    whileTap={{ scale: 0.95 }}
                    disabled={showConfirmModal}
                    className={`px-6 py-3 rounded-md border font-bold text-white backdrop-blur-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-400
                      ${showConfirmModal
                        ? "bg-cyan-400 cursor-not-allowed opacity-60"
                        : "bg-cyan-600 hover:bg-cyan-500 border-cyan-400 cursor-pointer"}`}
                  >
                    Accept Price
                  </motion.button>
                ):(
                    <div className="w-full h-full px-2 py-2.5 flex items-center justify-center rounded-md border border-gray-500 bg-gray-800 text-gray-300 font-medium cursor-not-allowed shadow-inner text-sm">
                      You created this auction
                    </div>
                )
              }
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
                        className="w-full px-3 py-1.5 rounded-md bg-cyan-600 text-white text-sm hover:bg-cyan-700 font-semibold cursor-pointer"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
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

      {/* Auction details Modal */}
      <AuctionDetailsModal
        open={detailsOpen}
        onClose={() => {
          console.log("Closing modal");
          setDetailsOpen(false);
        }}
        auction={auction}
      />

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

export default AuctionCardDutch;
