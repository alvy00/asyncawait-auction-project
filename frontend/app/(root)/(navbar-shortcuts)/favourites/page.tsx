/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser } from "../../../../lib/user-context";
import { Auction } from "../../../../lib/interfaces";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaHeartBroken, FaSpinner } from "react-icons/fa";
import { useAuth } from "../../../../lib/auth-context";
import AuctionCard from "../../../components/AuctionCard";
import AuctionCardBlitz from "../../../components/AuctionCardBlitz";
import AuctionCardDutch from "../../../components/AuctionCardDutch";
import AuctionCardReverse from "../../../components/AuctionCardReverse";
import AuctionCardPhantom from "../../../components/AuctionCardPhantom";

const FavouritesPage = () => {
  const { user } = useUser();
  const { loggedIn, token } = useAuth();
  const [favAuctionIds, setFavAuctionIds] = useState<string[]>([]);
  const [favAuctions, setFavAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

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

  // fetch favourited auctions
  useEffect(() => {
    const fetchFavourites = async () => {
      if (!user?.user_id) return;

      setLoading(true);
      try {
        const res = await fetch(
          "https://asyncawait-auction-project.onrender.com/api/auctions/favauctions",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.user_id }),
          }
        );

        if (!res.ok) throw new Error("Failed to fetch fav auction IDs");

        const data = await res.json();
        setFavAuctionIds(data);
      } catch (err) {
        console.error(err);
        toast.error("Could not load your favorites.");
      }
    };

    fetchFavourites();
  }, [user?.user_id]);

  // fetch auction details
  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const auctionPromises = favAuctionIds.map((auction_id) =>
          fetch("https://asyncawait-auction-project.onrender.com/api/auctions/aucdetails", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ auction_id }),
          }).then((res) => res.json())
        );

        const results = await Promise.all(auctionPromises);
        const liveFavAucs = results.filter((auction) => auction.status !== 'ended');
        setFavAuctions(liveFavAucs);
      } catch (e) {
        console.error("Error fetching auction details:", e);
      } finally {
        setLoading(false);
      }
    };

    if (favAuctionIds.length > 0) {
      fetchAuctionDetails();
    } else {
      setLoading(false);
    }
  }, [favAuctionIds]);

  return (
    <section className="py-16 min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-pink-500/10 rounded-full filter blur-[120px] animate-pulse-slow"></div>
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
            className="mt-10 text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Your Favourite{" "}
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
            Explore the auctions you&apos;ve loved. Ready to place your winning bid?
          </motion.p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              className="text-pink-500 mb-4"
            >
              <FaSpinner className="animate-spin h-12 w-12" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-300 text-lg"
            >
              Loading your favourited auctions...
            </motion.p>
          </div>
        ) : favAuctions.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block p-6 rounded-full bg-white/5 backdrop-blur-md mb-6">
              <FaHeartBroken className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No favourites yet</h3>
            <p className="text-gray-400">Start browsing and add some favourites!</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 ml-7 mr-7"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {favAuctions.map((auction, index) => (
              <motion.div
                key={auction.auction_id}
                className="hover:scale-105 transform transition-all duration-300 ease-in-out"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.25 }}
              >
                {auction.auction_type === "classic" && (
                  <AuctionCard
                    auction={auction}
                    auctionCreator={auction.creator}
                    isFavourited={true}
                    user={user}
                    loggedIn={loggedIn}
                    token={token}
                  />
                )}
                {auction.auction_type === "blitz" && (
                  <AuctionCardBlitz
                    auction={auction}
                    auctionCreator={auction.creator}
                    user={user}
                    loggedIn={loggedIn}
                    token={token} 
                    isFavourited={true}                  
                  />
                )}
                {auction.auction_type === "dutch" && (
                  <AuctionCardDutch
                    auction={auction}
                    auctionCreator={auction.creator}
                    user={user}
                    loggedIn={loggedIn}
                    token={token}
                    isFavourited={true}
                  />
                )}
                {auction.auction_type === "reverse" && (
                  <AuctionCardReverse
                    auction={auction}
                    auctionCreator={auction.creator}
                    user={user}
                    loggedIn={loggedIn}
                    token={token}
                    isFavourited={true}
                  />
                )}
                {auction.auction_type === "phantom" && (
                  <AuctionCardPhantom
                    auction={auction}
                    auctionCreator={auction.creator}
                    user={user}
                    loggedIn={loggedIn}
                    token={token}
                    isFavourited={true}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FavouritesPage;
