"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../../../../lib/user-context";
import { useAuth } from "../../../../lib/auth-context";
import { Auction } from "../../../../lib/interfaces";
import AuctionCard from "../../../components/AuctionCard";
import AuctionCardBlitz from "../../../components/AuctionCardBlitz";
import AuctionCardDutch from "../../../components/AuctionCardDutch";
import AuctionCardReverse from "../../../components/AuctionCardReverse";
import AuctionCardPhantom from "../../../components/AuctionCardPhantom";
import { motion } from "framer-motion";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";

const DuePayment = () => {
  const { user } = useUser();
  const { loggedIn, token, isReady } = useAuth();

  const [unpaidAuctions, setUnpaidAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // fetch unpaid auctions
  useEffect(() => {
    if (!user?.user_id || !isReady) return;

    const fetchDuePayments = async () => {
      setIsLoading(true);
      try {
        // https://asyncawait-auction-project.onrender.com/api/auctions/unpaid
        // http://localhost:8000/api/auctions/unpaid
        const res = await fetch("https://asyncawait-auction-project.onrender.com/api/auctions/unpaid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: user.user_id }),
        });

        if (!res.ok) {
          const err = await res.json();
          console.error(err.message || "Failed to fetch won auctions.");
          setUnpaidAuctions([]);
          return;
        }

        const data = await res.json();
        setUnpaidAuctions(data);
      } catch (err) {
        console.error("Error fetching due payments:", err);
        setUnpaidAuctions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDuePayments();
  }, [user?.user_id, isReady]);

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

  if (!isReady) return;

  return (
    <section className="py-16 min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-red-500/10 rounded-full filter blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] bg-yellow-500/5 rounded-full filter blur-[80px] animate-float"></div>
        <div className="absolute top-[30%] left-[10%] w-[200px] h-[200px] bg-purple-500/5 rounded-full filter blur-[60px] animate-float-delayed"></div>
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
            Your Due{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Payments
            </span>
          </motion.h1>
          <motion.p
            className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Complete your payments to claim the auctions you&apos;ve won!
          </motion.p>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              className="text-red-500 mb-4"
            >
              <FaSpinner className="animate-spin h-12 w-12" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-300 text-lg"
            >
              Fetching your unpaid winnings...
            </motion.p>
          </div>
        ) : unpaidAuctions.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 ml-7 mr-7"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {unpaidAuctions.map((auction, index) => (
              <motion.div
                key={auction.auction_id}
                className="hover:scale-105 transform transition-all duration-300 ease-in-out"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.25 }}
              >
                {auction.auction_type === "classic" && (
                  <AuctionCard auction={auction} auctionCreator={auction.creator} user={user} loggedIn={loggedIn} token={token} isFavourited={false} />
                )}
                {auction.auction_type === "blitz" && (
                  <AuctionCardBlitz auction={auction} auctionCreator={auction.creator} user={user} loggedIn={loggedIn} token={token} />
                )}
                {auction.auction_type === "dutch" && (
                  <AuctionCardDutch auction={auction} auctionCreator={auction.creator} user={user} loggedIn={loggedIn} token={token} />
                )}
                {auction.auction_type === "reverse" && (
                  <AuctionCardReverse auction={auction} auctionCreator={auction.creator} user={user} loggedIn={loggedIn} token={token} />
                )}
                {auction.auction_type === "phantom" && (
                  <AuctionCardPhantom auction={auction} auctionCreator={auction.creator} user={user} loggedIn={loggedIn} token={token} />
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
              <FaExclamationTriangle className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No due payments found</h3>
            <p className="text-gray-400">You&apos;re all caught up! 🎉</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DuePayment;
