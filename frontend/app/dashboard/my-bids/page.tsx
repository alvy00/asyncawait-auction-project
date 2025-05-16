"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaChevronLeft, FaChevronRight, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import { Button } from "../../../components/ui/button";
import { Countdown } from "../../components/Countdown";

const FALLBACK_IMAGE = "/fallback.jpg";

// Sample bid data to display
interface Bid {
  bid_id: string;
  auction_id: string;
  item_name: string;
  item_image: string;
  bid_amount: number;
  bid_time: string;
  auction_end_time: string;
  status: "active" | "won" | "lost" | "pending";
  current_highest_bid: number;
  is_highest_bidder: boolean;
  category: string;
  condition: string;
}

const SAMPLE_BIDS: Bid[] = [
  {
    bid_id: "bid-1",
    auction_id: "auction-1",
    item_name: "Vintage Leica Camera",
    item_image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
    bid_amount: 275.00,
    bid_time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    auction_end_time: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    status: "active",
    current_highest_bid: 275.00,
    is_highest_bidder: true,
    category: "electronics",
    condition: "used"
  },
  {
    bid_id: "bid-2",
    auction_id: "auction-2",
    item_name: "Modern Art Painting",
    item_image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop",
    bid_amount: 420.50,
    bid_time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    auction_end_time: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
    status: "active",
    current_highest_bid: 450.75,
    is_highest_bidder: false,
    category: "art",
    condition: "new"
  },
  {
    bid_id: "bid-3",
    auction_id: "auction-3",
    item_name: "Antique Pocket Watch",
    item_image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=1000&auto=format&fit=crop",
    bid_amount: 650.00,
    bid_time: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    auction_end_time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago (ended)
    status: "won",
    current_highest_bid: 650.00,
    is_highest_bidder: true,
    category: "other",
    condition: "refurbished"
  },
  {
    bid_id: "bid-4",
    auction_id: "auction-4",
    item_name: "Designer Handbag",
    item_image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop",
    bid_amount: 380.00,
    bid_time: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    auction_end_time: new Date(Date.now() - 172800000).toISOString(), // 2 days ago (ended)
    status: "lost",
    current_highest_bid: 425.00,
    is_highest_bidder: false,
    category: "fashion",
    condition: "new"
  },
  {
    bid_id: "bid-5",
    auction_id: "auction-5",
    item_name: "Vintage Vinyl Records Collection",
    item_image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1000&auto=format&fit=crop",
    bid_amount: 180.00,
    bid_time: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    auction_end_time: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
    status: "active",
    current_highest_bid: 210.00,
    is_highest_bidder: false,
    category: "other",
    condition: "used"
  }
];

const MyBidsPage = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalBids: 0,
    activeBids: 0,
    wonBids: 0,
    lostBids: 0,
    pendingBids: 0,
    totalSpent: 0
  });
  const [filter, setFilter] = useState<"all" | "active" | "won" | "lost">("all");
  
  const router = useRouter();

  useEffect(() => {
    const fetchMyBids = async () => {
      const token = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
      
      if (!token) {
        router.push("/login");
        return;
      }
      
      try {
        setLoading(true);
        // In a real implementation, you would fetch from your API
        // const res = await fetch("https://asyncawait-auction-project.onrender.com/api/bids/my-bids", {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        
        // if (!res.ok) {
        //   throw new Error("Failed to fetch your bids");
        // }
        
        // const data = await res.json();
        
        // For now, use sample data
        const data = SAMPLE_BIDS;
        setBids(data);
        
        // Calculate stats
        const statsData = {
          totalBids: data.length,
          activeBids: data.filter(b => b.status === "active").length,
          wonBids: data.filter(b => b.status === "won").length,
          lostBids: data.filter(b => b.status === "lost").length,
          pendingBids: data.filter(b => b.status === "pending").length,
          totalSpent: data.reduce((acc, curr) => curr.status === "won" ? acc + curr.bid_amount : acc, 0)
        };
        
        setStats(statsData);
      } catch (err) {
        console.error("Error fetching bids:", err);
        setError(err.message || "Failed to load bids");
        
        // Use sample data on error
        const data = SAMPLE_BIDS;
        setBids(data);
        
        // Calculate stats from sample data
        const statsData = {
          totalBids: data.length,
          activeBids: data.filter(b => b.status === "active").length,
          wonBids: data.filter(b => b.status === "won").length,
          lostBids: data.filter(b => b.status === "lost").length,
          pendingBids: data.filter(b => b.status === "pending").length,
          totalSpent: data.reduce((acc, curr) => curr.status === "won" ? acc + curr.bid_amount : acc, 0)
        };
        
        setStats(statsData);
        
        // Show a toast notification instead of a full error screen
        toast.error("Using sample data - " + (err.message || "Failed to load your bids"));
      } finally {
        setLoading(false);
      }
    };

    fetchMyBids();
  }, [router]);

  const handleViewAuction = (auctionId: string) => {
    router.push(`/auctions/${auctionId}`);
  };

  const handlePlaceBid = (auctionId: string) => {
    router.push(`/auctions/${auctionId}?bid=true`);
  };

  const filteredBids = filter === "all" ? bids : bids.filter(bid => bid.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">My Bids</h1>
          <p className="text-gray-400">Track your bidding activity and auction status</p>
        </div>
        <Button 
          onClick={() => router.push("/auctions")} 
          className="mt-4 md:mt-0 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium px-4 py-2 rounded-md flex items-center gap-2 border border-white/10 shadow-lg"
        >
          Explore Auctions
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <h3 className="text-gray-400 text-sm mb-1">Total Bids</h3>
          <p className="text-2xl font-bold text-white">{stats.totalBids.toString().padStart(2, '0')}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <h3 className="text-gray-400 text-sm mb-1">Active Bids</h3>
          <p className="text-2xl font-bold text-white">{stats.activeBids.toString().padStart(2, '0')}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <h3 className="text-gray-400 text-sm mb-1">Won Auctions</h3>
          <p className="text-2xl font-bold text-white">{stats.wonBids.toString().padStart(2, '0')}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <h3 className="text-gray-400 text-sm mb-1">Lost Auctions</h3>
          <p className="text-2xl font-bold text-white">{stats.lostBids.toString().padStart(2, '0')}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <h3 className="text-gray-400 text-sm mb-1">Pending Results</h3>
          <p className="text-2xl font-bold text-white">{stats.pendingBids.toString().padStart(2, '0')}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <h3 className="text-gray-400 text-sm mb-1">Total Spent</h3>
          <p className="text-2xl font-bold text-white">${stats.totalSpent.toFixed(2)}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={() => setFilter("all")} 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${filter === "all" ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white border border-white/20" : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"}`}
        >
          All Bids
        </button>
        <button 
          onClick={() => setFilter("active")} 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${filter === "active" ? "bg-gradient-to-r from-green-500 to-teal-500 text-white border border-white/20" : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"}`}
        >
          Active
        </button>
        <button 
          onClick={() => setFilter("won")} 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${filter === "won" ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border border-white/20" : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"}`}
        >
          Won
        </button>
        <button 
          onClick={() => setFilter("lost")} 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${filter === "lost" ? "bg-gradient-to-r from-red-500 to-rose-500 text-white border border-white/20" : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"}`}
        >
          Lost
        </button>
      </div>

      {/* Divider */}
      <div className="border-b border-white/10 mb-8"></div>

      {/* Bids List */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center justify-between">
          <span>My Bidding History</span>
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10">
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10">
              <FaChevronRight className="h-4 w-4" />
            </button>
          </div>
        </h2>

        {filteredBids.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 text-center border border-white/10">
            <p className="text-gray-400 mb-4">You haven't placed any bids yet.</p>
            <Button 
              onClick={() => router.push("/auctions")} 
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border border-white/10 shadow-lg"
            >
              Explore Auctions
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBids.map((bid) => (
              <BidCard 
                key={bid.bid_id} 
                bid={bid} 
                onViewAuction={() => handleViewAuction(bid.auction_id)} 
                onPlaceBid={() => handlePlaceBid(bid.auction_id)} 
              />
            ))}
          </div>
        )}
      </div>
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
  const [isEnded, setIsEnded] = useState(new Date(bid.auction_end_time) < new Date());
  
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
              src={bid.item_image || FALLBACK_IMAGE} 
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
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded">
                  {bid.category.charAt(0).toUpperCase() + bid.category.slice(1)}
                </span>
                <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded">
                  {bid.condition.charAt(0).toUpperCase() + bid.condition.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Bid Placed</p>
                  <p className="text-white text-sm">{new Date(bid.bid_time).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Current Highest</p>
                  <p className="text-white text-sm">${bid.current_highest_bid.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Your Status</p>
                  <p className={`text-sm ${bid.is_highest_bidder ? "text-green-400" : "text-orange-400"}`}>
                    {bid.is_highest_bidder ? "Highest Bidder" : "Outbid"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Time Remaining</p>
                  <p className="text-white text-sm">
                    {isEnded ? (
                      <span className="text-gray-400">Auction Ended</span>
                    ) : (
                      <Countdown endTime={bid.auction_end_time} onComplete={() => setIsEnded(true)} />
                    )}
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
              {!isEnded && bid.status === "active" && !bid.is_highest_bidder && (
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