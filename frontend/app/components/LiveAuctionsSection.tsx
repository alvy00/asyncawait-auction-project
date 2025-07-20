/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AuctionCard from './AuctionCard';
import { Auction } from '../../lib/interfaces';
import AuctionCardBlitz from './AuctionCardBlitz';
import AuctionCardDutch from './AuctionCardDutch';
import AuctionCardReverse from './AuctionCardReverse';
import AuctionCardPhantom from './AuctionCardPhantom';
import { useUser } from '../../lib/user-context';

const maxVisibleItems = 3;

const LiveAuctionsSection = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  // fetch featured auctions
  useEffect(() => {
    const fetchFeaturedAuctions = async () => {
      try {
        const res = await fetch("https://asyncawait-auction-project.onrender.com/api/auctions/featured", {
          method: "GET",
          headers: { "Content-type": "application/json" }
        });

        if (!res.ok) return;

        const data = await res.json();
        setAuctions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedAuctions();
  }, []);

  // fetch user
  // useEffect(() => {
  //   let isMounted = true;
  //   setIsLoading(true);

  //   const getUser = async () => {
  //     const token = localStorage.getItem('sessionToken') || sessionStorage.getItem('sessionToken');

  //     if (!token) {
  //       console.warn('No token found');
  //       setIsLoading(false);
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

  //       const data = await res.json();

  //       if (!res.ok) {
  //         console.error('Failed to fetch user:', data?.message || res.statusText);
  //         return;
  //       }

  //       if (isMounted) {
  //         setUser(data);
  //       }
  //     } catch (e) {
  //       console.error('Error fetching user:', e);
  //     } finally {
  //       if (isMounted) {
  //         setIsLoading(false);
  //       }
  //     }
  //   };

  //   getUser();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  const totalSlides = Math.ceil(auctions.length / maxVisibleItems);
  const goToPrevSlide = () => setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  const goToNextSlide = () => setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Featured <span className="ml-2">Auctions</span></h2>
            <p className="text-gray-400 text-sm md:text-base mt-1">Handpicked deals from trusted sellers</p>
          </div>

          {/* Arrows
          <div className="hidden md:flex items-center space-x-3">
            <button onClick={goToPrevSlide} className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-white hover:bg-gray-800 transition-colors" aria-label="Previous slide">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/></svg>
            </button>
            <button onClick={goToNextSlide} className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-white hover:bg-gray-800 transition-colors" aria-label="Next slide">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>
            </button>
          </div> */}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 min-h-[300px]">
          {isLoading ? (
            Array.from({ length: maxVisibleItems }).map((_, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse space-y-4 backdrop-blur-sm shadow-inner">
                <div className="h-95 bg-gray-700/30 rounded-md"></div>
                <div className="h-4 bg-gray-600/30 rounded w-3/4"></div>
                <div className="h-3 bg-gray-500/20 rounded w-1/2"></div>
                <div className="flex items-center justify-between mt-3">
                  <div className="h-4 w-20 bg-gray-500/30 rounded"></div>
                  <div className="h-4 w-10 bg-gray-500/20 rounded"></div>
                </div>
              </div>
            ))
          ) : auctions.length ? (
            auctions.map((auction) => (
              <motion.div 
                key={auction.auction_id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {auction.auction_type === "classic" && (
                  <AuctionCard
                    key={`${auction.auction_id}-${auction.isFavorite ? "fav" : "no-fav"}`}
                    auction={auction}
                    auctionCreator={auction.creator}
                    isFavourited={auction.isFavorite}
                    user={user}
                  />
                )}
                {auction.auction_type === "blitz" && (
                  <AuctionCardBlitz 
                    key={`${auction.auction_id}-${auction.isFavorite ? "fav" : "no-fav"}`}
                    auction={auction} 
                    auctionCreator={auction.creator}
                    user={user} 
                  />
                )}
                {auction.auction_type === "dutch" && (
                  <AuctionCardDutch 
                    key={`${auction.auction_id}-${auction.isFavorite ? "fav" : "no-fav"}`}
                    auction={auction} 
                    auctionCreator={auction.creator}
                    user={user} 
                  />
                )}
                {auction.auction_type === "reverse" && (
                  <AuctionCardReverse 
                    key={`${auction.auction_id}-${auction.isFavorite ? "fav" : "no-fav"}`}
                    auction={auction} 
                    auctionCreator={auction.creator}
                    user={user} 
                  />
                )}
                {auction.auction_type === "phantom" && (
                  <AuctionCardPhantom 
                    key={`${auction.auction_id}-${auction.isFavorite ? "fav" : "no-fav"}`}
                    auction={auction} 
                    auctionCreator={auction.creator}
                    user={user} 
                  />
                )}
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-center text-white bg-black/30 rounded-xl backdrop-blur-md border border-white/10">
              <h2 className="text-xl font-bold mb-2">No Featured Auctions</h2>
              <p className="text-gray-400 text-sm">Check back later or explore other listings.</p>
            </div>
          )}
        </div>

        {/* View All Auctions */}
        <div className="flex justify-center mt-8">
          <Link href="/auctions/live" className="text-white text-sm font-medium flex items-center border-b border-gray-600 pb-1 hover:border-white transition-colors">
            View All Auctions
            <svg className="h-4 w-4 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"/></svg>
          </Link>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden justify-between items-center mt-6">
          <button onClick={goToPrevSlide} className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/></svg>
          </button>
          <button onClick={goToNextSlide} className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default LiveAuctionsSection;
