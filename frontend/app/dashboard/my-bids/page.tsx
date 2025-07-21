/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaHourglassHalf,
  FaTimesCircle,
} from "react-icons/fa";
import { Button } from "../../../components/ui/button";
import { useUser } from "../../../lib/user-context";
import { Auction } from "../../../lib/interfaces";

  const imageSrc = "/fallback.jpg";

interface Bid {
  is_highest_bidder: any;
  bid_id: string;
  auction_id: string;
  user_id: string;
  item_name: string;
  bid_amount: number;
  created_at: string;
  status: string;
}

const MyBidsPage = () => {
  const { user } = useUser();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "won" | "lost">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const bidsPerPage = 10;
  const router = useRouter();

  // fetch auctions
  useEffect(() => {
    const fetchAllAuctions = async () => {
      try {
        const res = await fetch("https://asyncawait-auction-project.onrender.com/api/auctions");
        const data = await res.json();
        setAuctions(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAllAuctions();
  }, []);

  // fetch bids
  useEffect(() => {
    if (!user) return;
    const fetchBids = async () => {
      try {
        const res = await fetch("https://asyncawait-auction-project.onrender.com/api/auctions/bidhistory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.user_id }),
        });
        const r = await res.json();
        setBids(r);
      } catch (err) {
        console.error("Failed to fetch bids", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, [user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // filter bids
  const filteredBids = bids.filter((bid) => {
    switch (filter) {
      case "active":
        return bid.status === "active";
      case "won": {
        const auction = auctions.find((a) => a.auction_id === bid.auction_id);
        return auction?.highest_bidder_id === user?.user_id;
      }
      case "lost": {
        const auction = auctions.find((a) => a.auction_id === bid.auction_id);
        return auction?.highest_bidder_id && auction?.highest_bidder_id !== user?.user_id;
      }
      default:
        return true;
    }
  });

  const indexOfLastBid = currentPage * bidsPerPage;
  const indexOfFirstBid = indexOfLastBid - bidsPerPage;
  const currentBids = filteredBids.slice(indexOfFirstBid, indexOfLastBid);
  const totalPages = Math.ceil(filteredBids.length / bidsPerPage);

  const handleViewAuction = (auctionId: string) => router.push(`/auctions/${auctionId}`);
  const handlePlaceBid = (auctionId: string) => router.push(`/auctions/${auctionId}?bid=true`);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mt-10 p-6 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">My Bids</h1>
          <p className="text-gray-400">Track your bidding activity and auction status</p>
        </div>
        <Button
          onClick={() => router.push("/auctions")}
          className="mt-4 md:mt-0 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium px-4 py-2 rounded-md border border-white/10 shadow-lg"
        >
          Explore Auctions
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "all", label: "All Bids" },
          { key: "active", label: "Active" },
          { key: "won", label: "Won" },
          { key: "lost", label: "Lost" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              filter === key
                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white border border-white/20"
                : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="border-b border-white/10 mb-8"></div>

      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">My Bidding History</h2>

      {filteredBids.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 text-center border border-white/10">
          <p className="text-gray-400 mb-4">You haven&apos;t placed any bids yet.</p>
          <Button
            onClick={() => router.push("/auctions")}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border border-white/10 shadow-lg"
          >
            Explore Auctions
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {currentBids.map((bid) => (
              <BidCard
                key={bid.bid_id}
                bid={bid}
                onViewAuction={() => handleViewAuction(bid.auction_id)}
                onPlaceBid={() => handlePlaceBid(bid.auction_id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2 flex-wrap">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 bg-white/10 text-sm text-white hover:bg-white/20 disabled:opacity-40"
              >
                <FaChevronLeft />
              </Button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    currentPage === i + 1
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 bg-white/10 text-sm text-white hover:bg-white/20 disabled:opacity-40"
              >
                <FaChevronRight />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Bid Card component
interface BidCardProps {
  bid: Bid;
  onViewAuction: () => void;
  onPlaceBid: () => void;
}

const BidCard: React.FC<BidCardProps> = ({ bid, onViewAuction }) => { 

  const getStatusColor = () => {
    switch (bid.status) {
      case "active":
        return "from-green-500 to-teal-500";
      case "won":
        return "from-purple-500 to-indigo-500";
      case "lost":
        return "from-red-500 to-rose-500";
      case "pending":
        return "from-yellow-500 to-amber-500";
      default:
        return "from-blue-500 to-cyan-500";
    }
  };

  const getStatusIcon = () => {
    switch (bid.status) {
      case "active":
        return <FaHourglassHalf className="text-white" />;
      case "won":
        return <FaCheckCircle className="text-white" />;
      case "lost":
        return <FaTimesCircle className="text-white" />;
      case "pending":
        return <FaHourglassHalf className="text-white" />;
      default:
        return null;
    }
  };
  
  return (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="w-full px-4 py-3 border-b border-white/10 hover:bg-white/5 transition"
  >
    <div className="flex items-start gap-4">
      
      {/* Image / Placeholder */}
      <div className="w-20 h-20 rounded-md overflow-hidden bg-white/10 relative shrink-0">
        {/* Optional image */}
        {/* <Image src={imageSrc} alt={bid.item_name} fill className="object-cover" /> */}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="text-white font-semibold truncate">{bid.item_name}</h3>
          <span className="text-orange-400 font-bold text-sm">
            ${bid.bid_amount.toFixed(2)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300 mt-1">
          {bid.category && (
            <span className="bg-white/10 px-2 py-0.5 rounded">
              {bid.category.charAt(0).toUpperCase() + bid.category.slice(1)}
            </span>
          )}
          {bid.condition && (
            <span className="bg-white/10 px-2 py-0.5 rounded">
              {bid.condition.charAt(0).toUpperCase() + bid.condition.slice(1)}
            </span>
          )}
          <span>
            {new Date(bid.created_at.replace('+00', 'Z')).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <span className={bid.is_highest_bidder ? "text-green-400" : "text-orange-400"}>
            {bid.is_highest_bidder ? "Highest Bidder" : "Outbid"}
          </span>
        </div>
      </div>

      {/* Action */}
      <Button
        onClick={onViewAuction}
        className="ml-auto text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5"
      >
        View
      </Button>
    </div>
  </motion.div>
  );
};

export default MyBidsPage;