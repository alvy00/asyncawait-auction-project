/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useMemo, useState } from "react";
import AuctionCard from "../../../components/AuctionCard";
import { Auction, User } from "../../../../lib/interfaces";
import { FaSpinner, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const LiveAuctionsPage = () => {
  const [user, setUser] = useState<User>();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);
  const [favAuctionIDs, setFavAuctionIDs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavsLoading, setIsFavsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Categories for filter pills
  const categories = [
    "all",
    "watches",
    "jewelry",
    "art",
    "collectibles",
    "fashion",
  ];

  // fetch user
  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem('sessionToken') || sessionStorage.getItem('sessionToken');
      if (!token) {
        console.warn('No token found');
        return;
      }

      try {
        const res = await fetch('https://asyncawait-auction-project.onrender.com/api/getuser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          console.error('Failed to fetch user:', err.message);
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (e) {
        console.error('Error fetching user:', e);
      }
    };
    getUser();
  }, []);
  
  // Fetch all auctions on mount
  useEffect(() => {
    const fetchAllAuctions = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllAuctions();
  }, []);

  // Fetch user's favorite auction IDs when user is available
  useEffect(() => {

    if (!user?.user_id) return;

    const fetchFavAuctionIDs = async () => {
      try {
        const res = await fetch(
          "https://asyncawait-auction-project.onrender.com/api/auctions/favauctions",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ user_id: user.user_id }),
          }
        );

        if (!res.ok) {
          const r = await res.json();
          console.error(r.message || r.statusText);
          return;
        }

        const data = await res.json();
        console.log(user.user_id)
        console.log(data)
        setFavAuctionIDs(data);
        
      } catch (e) {
        console.error(e);
      } finally {
        setIsFavsLoading(false);
      }
    };

    fetchFavAuctionIDs();
  }, [user?.user_id]);


  // Filter auctions based on search term and active filter
  useEffect(() => {
    const filtered = auctions.filter((auction) => {
      const matchesSearch = auction.item_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        activeFilter === "all" ||
        auction.category?.toLowerCase() === activeFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });

    // console.log("Filtered auctions:", filtered);
    setFilteredAuctions(filtered);
  }, [auctions, searchTerm, activeFilter]);
  

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        when: "beforeChildren",
      },
    },
  };

  const isAnyLoading = isLoading || isFavsLoading;
  return (
    <section className="py-16 min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        {/* Large gradient circle */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-500/10 rounded-full filter blur-[120px] animate-pulse-slow"></div>

        {/* Small accent circles */}
        <div className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] bg-purple-500/5 rounded-full filter blur-[80px] animate-float"></div>
        <div className="absolute top-[30%] left-[10%] w-[200px] h-[200px] bg-blue-500/5 rounded-full filter blur-[60px] animate-float-delayed"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero section with animated title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover Live{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Auctions
            </span>
          </motion.h1>
          <motion.p
            className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Bid on exclusive items from around the world with our real-time auction
            platform
          </motion.p>
        </motion.div>

        {/* Search and filter section */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Search bar */}
          <div className="relative max-w-md mx-auto mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === category
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20"
                    : "bg-white/5 backdrop-blur-sm text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
                onClick={() => setActiveFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>


        {/* Auctions grid with staggered animation */}
        {isAnyLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
              <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              className="text-orange-500 mb-4"
              >
              <FaSpinner className="animate-spin h-12 w-12" />
              </motion.div>
              <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-300 text-lg"
              >
              Discovering exceptional auctions...
              </motion.p>
          </div>
          ) : filteredAuctions.length > 0 ? (
          <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="show"
          >
              {filteredAuctions.map((auction, index) => {
                // console.log(`Favourited: ${favAuctionIDs.includes(auction.auction_id)}`);
                // console.log(favAuctionIDs);
                return (
                  <motion.div
                    key={auction.auction_id}
                    className="hover:scale-105 transform transition-all duration-300 ease-in-out"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.25 }}
                  >
                    <AuctionCard
                      auction={auction}
                      auctionCreator={auction.creator}
                      isFavourited={favAuctionIDs.includes(auction.auction_id)}
                    />
                  </motion.div>
                );
              })}
          </motion.div>
          ) : (
          <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
          >
              <div className="inline-block p-6 rounded-full bg-white/5 backdrop-blur-md mb-6">
              <FaSearch className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No auctions found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </motion.div>
          )}
          </div>
    </section>
    );
}

export default LiveAuctionsPage;
