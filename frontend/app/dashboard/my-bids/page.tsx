"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaHourglassHalf,
} from "react-icons/fa";
import { Button } from "../../../components/ui/button";
import { useUser } from "../../../lib/user-context";
import { Auction } from "../../../lib/interfaces";

const FALLBACK_IMAGE = "/fallback.jpg";

interface Bid {
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
  const bidsPerPage = 6;
  const router = useRouter();

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
    <div className="p-6 min-h-screen">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

const BidCard: React.FC<BidCardProps> = ({ bid, onViewAuction, onPlaceBid }) => { 

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

  const getStatusText = () => {
    switch (bid.status) {
      case "active":
        return bid.is_highest_bidder ? "Highest Bidder" : "Outbid";
      case "won":
        return "Won";
      case "lost":
        return "Lost";
      case "pending":
        return "Pending";
      default:
        return "";
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative group h-full"
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20 h-full">
        {/* Glassmorphism card highlights */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-blue-500/10 opacity-30 group-hover:opacity-40 transition-opacity duration-700"></div>
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/5 to-transparent rotate-12 transform scale-2 opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
        </div>
        
        <div className="flex flex-col h-full">
          {/* Image */}
          <div className="relative w-full h-48 overflow-hidden">
            <Image 
              src={ FALLBACK_IMAGE }
              alt={bid.item_name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Status tag */}
            <div className={`absolute top-4 left-4 bg-gradient-to-r ${getStatusColor()} text-white text-xs font-medium px-4 py-1 z-10 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm`}>
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white text-lg font-bold truncate">{bid.item_name}</h3>
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500 font-bold text-xl">
                  ${bid.bid_amount.toFixed(2)}
                </div>
              </div>
              
              {/* Category and condition */}
              {/* <div className="flex items-center gap-2 mb-4">
                <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded">
                  {bid.category?.charAt(0).toUpperCase() + bid.category?.slice(1)}
                </span>
                <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded">
                  {bid.condition?.charAt(0).toUpperCase() + bid.condition?.slice(1)}
                </span>
              </div> */}
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Bid Placed</p>
                  <p className="text-white text-sm">
                     {new Date(bid.created_at.replace('+00', 'Z')).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                  </p>
                </div>
                {/* <div>
                  <p className="text-gray-400 text-xs mb-1">Current Highest</p>
                  <p className="text-white text-sm">${bid.current_highest_bid?.toFixed(2)}</p>
                </div> */}
                {/* <div>
                  <p className="text-gray-400 text-xs mb-1">Your Status</p>
                  <p className={`text-sm ${bid.is_highest_bidder ? "text-green-400" : "text-orange-400"}`}>
                    {bid.is_highest_bidder ? "Highest Bidder" : "Outbid"}
                  </p>
                </div> */}
                <div>
                  <p className="text-gray-400 text-xs mb-1">Time Remaining</p>
                  <p className="text-white text-sm">
                    <span>---</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <Button 
                onClick={onViewAuction}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm py-2 border border-white/10 shadow-lg"
              >
                View Auction
              </Button>
              { (
                <Button 
                  onClick={onPlaceBid}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-sm py-2 border border-white/10 shadow-lg"
                >
                  Place New Bid
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MyBidsPage;