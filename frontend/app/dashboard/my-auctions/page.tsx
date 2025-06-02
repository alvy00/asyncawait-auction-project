/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Auction } from "../../../lib/interfaces";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Button } from "../../../components/ui/button";
import { Countdown } from "../../components/Countdown";
import { FaBolt, FaClock, FaFlagCheckered } from "react-icons/fa";
import { useUser } from "../../../lib/user-context";

const FALLBACK_IMAGE = "/fallback.jpg";

// Sample auction data to display when no data is returned from the server
const SAMPLE_AUCTIONS: Auction[] = [
  {
    auction_id: "sample-1",
    creator: "You",
    item_name: "Vintage Camera Collection",
    description: "A rare collection of vintage cameras from the 1950s in excellent condition.",
    category: "electronics",
    starting_price: 199.99,
    highest_bid: 250.00,
    start_time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    end_time: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    status: "live",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop"],
    condition: "used"
  },
  {
    auction_id: "sample-2",
    creator: "You",
    item_name: "Limited Edition Art Print",
    description: "Signed and numbered limited edition print by renowned artist.",
    category: "art",
    starting_price: 349.99,
    highest_bid: 349.99,
    start_time: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
    end_time: new Date(Date.now() + 604800000).toISOString(), // 7 days from now
    status: "upcoming",
    images: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop"],
    condition: "new"
  },
  {
    auction_id: "sample-3",
    creator: "You",
    item_name: "Antique Pocket Watch",
    description: "18th century gold-plated pocket watch with intricate engravings.",
    category: "other",
    starting_price: 599.99,
    highest_bid: 780.50,
    highest_bidder_id: "sample-user",
    start_time: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    end_time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: "ended",
    images: ["https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=1000&auto=format&fit=crop"],
    condition: "refurbished"
  }
];

const MyAuctionsPage = () => {
  const { user } = useUser();
  const [auctions, setAuctions] = useState<Auction[]>();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    created: 0,
    running: 0,
    upcoming: 0,
    completed: 0,
    expired: 0,
    totalBids: 0,
  });
  
  const router = useRouter();

  // Fetch all auctions on mount
  useEffect(() => {
    const fetchAllAuctions = async () => {
      try {
        const res = await fetch(
          "https://asyncawait-auction-project.onrender.com/api/auctions",
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const r = await res.json();
          console.error(r.message || r.statusText);
          return;
        }

        const data = await res.json();
        setAuctions(data);

      } catch (e) {
        console.error(e);
      }
    };

    fetchAllAuctions();
  }, []);

  // Update stats
  useEffect(() => {
    if (!auctions || !user) return;

    setStats({
      created: auctions.length,
      running: auctions.filter(a => a.status === "live").length,
      upcoming: auctions.filter(a => a.status === "upcoming").length,
      completed: auctions.filter(a => a.status === "ended" && a.highest_bidder_id).length,
      expired: auctions.filter(a => a.status === "ended" && !a.highest_bidder_id).length,
      totalBids: user.bids_received ?? 0,
    });
  }, [auctions, user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleEdit = (auctionId: string) => {
    router.push(`/dashboard/my-auctions/edit/${auctionId}`);
  };

  const handleDelete = async (auctionId: string) => {
    if (!confirm("Are you sure you want to delete this auction?")) return;

    try {
      const res = await fetch("https://asyncawait-auction-project.onrender.com/api/auctions/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ auction_id: auctionId }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to delete auction");
        return;
      }

      toast.success("Auction deleted successfully");

      // Remove deleted auction from state
      setAuctions(prev => prev?.filter(a => a.auction_id !== auctionId));

      // Update stats
      const deletedAuction = auctions?.find(a => a.auction_id === auctionId);
      if (deletedAuction) {
        setStats(prev => ({
          ...prev,
          created: prev.created - 1,
          running: deletedAuction.status === "live" ? prev.running - 1 : prev.running,
          upcoming: deletedAuction.status === "upcoming" ? prev.upcoming - 1 : prev.upcoming,
          completed: deletedAuction.status === "ended" && deletedAuction.highest_bidder_id ? prev.completed - 1 : prev.completed,
          expired: deletedAuction.status === "ended" && !deletedAuction.highest_bidder_id ? prev.expired - 1 : prev.expired,
        }));
      }

    } catch (e) {
      console.error(e);
      toast.error("An error occurred while deleting");
    }
  };

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
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">My Auction Products</h1>
          <p className="text-gray-400">Manage your auction listings</p>
        </div>
        <Button 
          onClick={() => router.push("/auctions/create")} 
          className="mt-4 md:mt-0 bg-gradient-to-r from-orange-500 to-pink-600 cursor-pointer hover:from-orange-600 hover:to-pink-700 text-white font-medium px-6 py-2.5 rounded-md flex items-center gap-2 shadow-lg transition-all duration-300"
        >
          Create New Auction
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Auctions Created", value: stats?.created },
          { label: "Running Auction", value: stats?.running },
          { label: "Upcoming Auction", value: stats?.upcoming },
          { label: "Completed Auction", value: stats?.completed },
          { label: "Expired Auction", value: stats?.expired },
          { label: "Total Bid Received", value: stats?.totalBids },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-white">
              {String(stat.value ?? 0).padStart(2, '0')}
            </p>
          </div>
        ))}
      </div>

      {/* More Details Link */}
      <div className="flex justify-end mb-6">
        <button className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm">
          More Details <FaChevronRight className="h-3 w-3" />
        </button>
      </div>

      {/* Divider */}
      <div className="border-b border-white/10 mb-8"></div>

      {/* My Auction Products Section */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center justify-between">
          <span>My Auction Products</span>
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white">
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white">
              <FaChevronRight className="h-4 w-4" />
            </button>
          </div>
        </h2>

        {auctions?.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 text-center border border-white/10">
            <p className="text-gray-400 mb-4">You haven&apos;t created any auctions yet.</p>
            <Button 
              onClick={() => router.push("/auctions/create")} 
              className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white"
            >
              Create Your First Auction
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions
              ?.filter(auction => auction?.user_id === user?.user_id)
              .map(auction => (
                <AuctionCard
                  key={auction.auction_id}
                  auction={auction}
                  onEdit={() => handleEdit(auction.auction_id)}
                  onDelete={() => handleDelete(auction.auction_id)}
                />
              ))}
          </div>
        )}
      </div>

      {/* More Products Link */}
      {auctions.length > 0 && (
        <div className="flex justify-end mt-6">
          <button className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm">
            More Products <FaChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};

// Modified AuctionCard component for the dashboard
interface DashboardAuctionCardProps {
  auction: Auction;
  onEdit: () => void;
  onDelete: () => void;
}

const AuctionCard: React.FC<DashboardAuctionCardProps> = ({ auction, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEnded, setIsEnded] = useState(auction.status === "ended");
  
  const imageSrc = auction.images?.[0]?.trim() ? auction.images[0] : FALLBACK_IMAGE;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative h-[420px] group" // Increased height to prevent cut-off
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card content */}
      <div className="relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20">
        {/* Glassmorphism card highlights */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-blue-500/10 opacity-30 group-hover:opacity-40 transition-opacity duration-700"></div>
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/5 to-transparent rotate-12 transform scale-2 opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
        </div>
        
        {/* Image container with zoom effect */}
        <div className="relative h-[55%] overflow-hidden"> 
          <Image 
            src={imageSrc} 
            alt={auction.item_name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Glass overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
          
          {/* Status tag */}
          {auction.status === 'live' ? (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-medium px-4 py-1 z-10 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm">
              <FaBolt className="text-white animate-pulse" />
              <span>Live</span>
            </div>
          ) : auction.status === 'upcoming' ? (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-white text-xs font-medium px-4 py-1 z-10 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm">
              <FaClock className="text-white" />
              <span>Upcoming</span>
            </div>
          ) : (
            <div className="absolute top-4 left-4 bg-gray-600 text-white text-xs font-medium px-4 py-1 z-10 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm">
              <FaFlagCheckered className="text-white" />
              <span>Ended</span>
            </div>
          )}
          
          {/* Edit and Delete buttons */}
          <div className="absolute top-4 right-4 flex space-x-2 z-10">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8
              }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full transition-all duration-300 hover:scale-110 border border-white/20 shadow-lg"
            >
              <FaEdit className="h-4 w-4 text-white" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8
              }}
              transition={{ duration: 0.2, delay: 0.1 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="bg-white/10 hover:bg-red-500/70 backdrop-blur-md p-2 rounded-full transition-all duration-300 hover:scale-110 border border-white/20 shadow-lg"
            >
              <FaTrash className="h-4 w-4 text-white" />
            </motion.button>
          </div>
        </div>
        
        {/* Content with glass background effect */}
        <div className="p-5 bg-gradient-to-b from-black/50 via-black/70 to-black/80 backdrop-blur-md relative z-10 h-[45%] flex flex-col justify-between border-t border-white/10"> 
          <div>
            <h3 className="text-white text-lg font-bold mb-2 truncate">{auction.item_name}</h3>
            
            {/* Category and condition */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded">
                {auction.category.charAt(0).toUpperCase() + auction.category.slice(1)}
              </span>
              <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded">
                {auction.condition.charAt(0).toUpperCase() + auction.condition.slice(1)}
              </span>
            </div>
          </div>
          
          {/* Price and time */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500 font-bold text-xl">
                ${auction.highest_bid || auction.starting_price}
              </div>
              <div className="text-white text-xs bg-white/5 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10">
                {isEnded ? (
                  auction.highest_bidder_id ? (
                    <span className="text-green-400 font-bold">Sold</span>
                  ) : (
                    <span className="text-red-400 font-semibold">Expired</span>
                  )
                ) : (
                  <Countdown endTime={auction.end_time} onComplete={() => setIsEnded(true)} />
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm py-1.5 shadow-md transition-all duration-300 cursor-pointer"
              >
                Edit
              </Button>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white text-sm py-1.5 shadow-md transition-all duration-300 cursor-pointer"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MyAuctionsPage;