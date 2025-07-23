/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useUser } from "../../../../lib/user-context";
import AuctionCard from "../../../components/AuctionCard";
import { Auction, User } from "../../../../lib/interfaces";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaHeartBroken } from "react-icons/fa";

const FavouritesPage = () => {
  const { user } = useUser();
  const [favAuctionIds, setFavAuctionIds] = useState<string[]>([]);
  const [favAuctions, setFavAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch user
  // useEffect(() => {
  //   const getUser = async () => {
  //     const token = localStorage.getItem('sessionToken') || sessionStorage.getItem('sessionToken');
  //     if (!token) {
  //       console.warn('No token found');
  //       return;
  //     }

  //     try {
  //       const res = await fetch('https://asyncawait-auction-project.onrender.com/api/getuser', {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`,
  //         },
  //       });

  //       if (!res.ok) {
  //         const err = await res.json();
  //         console.error('Failed to fetch user:', err.message);
  //         return;
  //       }

  //       const data = await res.json();
  //       setUser(data);
  //     } catch (e) {
  //       console.error('Error fetching user:', e);
  //     }
  //   };
  //   getUser();
  // }, []);

  // fetch favorite auction IDs
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
        console.log("Fetched favourite IDs:", data);
      } catch (err) {
        console.error(err);
        toast.error("Could not load your favorites.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [user?.user_id]);

  // fetch auction details by ID
  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const auctionPromises = favAuctionIds.map((auction_id) =>
          fetch("https://asyncawait-auction-project.onrender.com/api/auctions/aucdetails", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ auction_id }),
          }).then((res) => res.json())
        );

        const results = await Promise.all(auctionPromises);
        setFavAuctions(results);
      } catch (e) {
        console.error("Error fetching auction details:", e);
      }
    };

    if (favAuctionIds.length > 0) {
      fetchAuctionDetails();
    }
  }, [favAuctionIds]);

  return (
    <section className="py-16 min-h-screen">
      <div className="container mx-auto px-4">
        <motion.h1
          className="text-4xl font-bold text-white mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your Favourite Auctions
        </motion.h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading favourites...</p>
        ) : favAuctions.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <FaHeartBroken className="mx-auto text-4xl mb-4" />
            <p>No favourites yet. Start browsing and add some!</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {favAuctions.map((auction) => (
              <motion.div
                key={auction.auction_id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <AuctionCard
                  auction={auction}
                  auctionCreator={auction.creator}
                  isFavourited={true}
                  user={user}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FavouritesPage;
