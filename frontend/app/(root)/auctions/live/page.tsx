/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useMemo } from "react";
import AuctionCard from "../../../components/AuctionCard";
import AuctionCardBlitz from "../../../components/AuctionCardBlitz";
import AuctionCardDutch from "../../../components/AuctionCardDutch";
import AuctionCardReverse from "../../../components/AuctionCardReverse";
import { Auction, User } from "../../../../lib/interfaces";
import { FaSpinner, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

const LiveAuctionsPage = () => {
  const [user, setUser] = useState<User>();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [favAuctionIDs, setFavAuctionIDs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavsLoading, setIsFavsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const categories = ["all", "electronics", "art", "vehicles", "fashion", "other"];

  // Get User
  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
      if (!token) {
        setUser(undefined);
        setFavAuctionIDs([]);
        setIsFavsLoading(false);
        return;
      }

      try {
        const res = await fetch("https://asyncawait-auction-project.onrender.com/api/getuser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          console.error("Failed to fetch user:", err.message);
          setUser(undefined);
          setFavAuctionIDs([]);
          setIsFavsLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (e) {
        console.error("Error fetching user:", e);
        setUser(undefined);
        setFavAuctionIDs([]);
        setIsFavsLoading(false);
      }
    };
    getUser();
  }, []);

  // Fetch All Live Auctions
  useEffect(() => {
    const fetchAllAuctions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("https://asyncawait-auction-project.onrender.com/api/auctions", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        });

        if (!res.ok) {
          const r = await res.json();
          console.error(r.message || r.statusText);
          setAuctions([]);
          return;
        }

        const data = await res.json();
        setAuctions(
          data.filter(
            (auction: Auction) =>
              new Date(auction.start_time) <= new Date() &&
              new Date() < new Date(auction.end_time)
          )
        );
      } catch (e) {
        console.error(e);
        setAuctions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllAuctions();
  }, []);

  // Fetch Favourited Auctions
  useEffect(() => {
    if (!user?.user_id) {
      setFavAuctionIDs([]);
      setIsFavsLoading(false);
      return;
    }

    const fetchFavAuctionIDs = async () => {
      setIsFavsLoading(true);
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
          setFavAuctionIDs([]);
          return;
        }

        const data = await res.json();
        setFavAuctionIDs(data);
      } catch (e) {
        console.error(e);
        setFavAuctionIDs([]);
      } finally {
        setIsFavsLoading(false);
      }
    };

    fetchFavAuctionIDs();
  }, [user?.user_id]);

  // Memoize filtered auctions with favorite status
  const filteredAuctions = useMemo(() => {
    return auctions
      .filter((auction) => {
        const matchesSearch = auction.item_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === "all" || auction.category?.toLowerCase() === activeFilter.toLowerCase();
        return matchesSearch && matchesFilter;
      })
      .map((auction) => ({
        ...auction,
        isFavorite: favAuctionIDs.includes(auction.auction_id),
      }));
  }, [auctions, searchTerm, activeFilter, favAuctionIDs]);

  const isAnyLoading = isLoading || isFavsLoading;

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

  return (
    <section className="py-16 min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-500/10 rounded-full filter blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] bg-purple-500/5 rounded-full filter blur-[80px] animate-float"></div>
        <div className="absolute top-[30%] left-[10%] w-[200px] h-[200px] bg-blue-500/5 rounded-full filter blur-[60px] animate-float-delayed"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Title */}
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
            Bid on exclusive items from around the world with our real-time auction platform
          </motion.p>
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
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

        {/* Content */}
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 ml-7 mr-7"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {filteredAuctions.map((auction, index) => (
              <motion.div
                key={auction.auction_id}
                className="hover:scale-105 transform transition-all duration-300 ease-in-out"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.25 }}
              >
                {auction.auction_type === "regular" && (
                  <AuctionCard
                    key={`${auction.auction_id}-${auction.isFavorite ? "fav" : "no-fav"}`}
                    auction={auction}
                    auctionCreator={auction.creator}
                    isFavourited={auction.isFavorite}
                  />
                )}
                {auction.auction_type === "blitz" && (
                  <AuctionCardBlitz auction={auction} auctionCreator={auction.creator} />
                )}
                {auction.auction_type === "dutch" && (
                  <AuctionCardDutch auction={auction} auctionCreator={auction.creator} />
                )}
                {auction.auction_type === "reverse" && (
                  <AuctionCardReverse auction={auction} auctionCreator={auction.creator} />
                )}
              </motion.div>
            ))}
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
};

export default LiveAuctionsPage;
