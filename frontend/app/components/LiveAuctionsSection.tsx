/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';
import AuctionCard from './AuctionCard';
import { Auction } from '../../lib/interfaces';

// Sample auction data for fallback
const sampleAuctions = [
  {
    auction_id: 1,
    item_name: "ROLEX Submariner 2020 Edition (Condition - 100% Fresh)",
    starting_price: 550.00,
    highest_bid: 550.00,
    highest_bidder_id: null,
    end_time: new Date(Date.now() + 3600000 * 2 + 900000 + 43000).toISOString(), // 2h 15m 43s from now
    images: ["https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    creator_name: "Weston Bennett",
    status: "ongoing",
    category: "watches"
  },
  {
    auction_id: 2,
    item_name: "Canon EOS 90D DSLR Camera (Body + 18-135mm Lens)",
    starting_price: 645.00,
    highest_bid: 645.00,
    highest_bidder_id: null,
    end_time: new Date(Date.now() + 3600000 * 3 + 1200000).toISOString(), // 3h 20m from now
    images: ["https://images.unsplash.com/photo-1520991459559-9b3b6ec6a52b?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    creator_name: "Egans Lab",
    status: "ongoing",
    category: "electronics"
  },
  {
    auction_id: 3,
    item_name: "Toyota Corolla SE 2020 – Automatic – Petrol",
    starting_price: 8400.00,
    highest_bid: 8400.00,
    highest_bidder_id: null,
    end_time: new Date(Date.now() + 3600000 * 5).toISOString(), // 5h from now
    images: ["https://images.unsplash.com/photo-1638618164682-12b986ec2a75?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    creator_name: "Jhon Smith",
    status: "ongoing",
    category: "vehicles"
  },
];

const LiveAuctionsSection = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const maxVisibleItems = 3; // Maximum number of items visible at once
  
  // Fetch featured auctions
  useEffect(() => {
    const fetchFeaturedAuctions = async () => {
      try {
        const res = await fetch(
          "https://asyncawait-auction-project.onrender.com/api/auctions/featured",
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }
        );

        if (!res.ok) {
          // If API fails, use sample data
          setAuctions(sampleAuctions);
          return;
        }

        const data = await res.json();
        setAuctions(data.length > 0 ? data : sampleAuctions);
      } catch (e) {
        console.error(e);
        // Fallback to sample data on error
        setAuctions(sampleAuctions);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedAuctions();
  }, []);
  
  const totalSlides = Math.ceil(auctions.length / maxVisibleItems);
  
  // Navigation functions
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };
  
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };
  
  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header with title and subtitle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              <span className="text-white">Featured</span>
              <span className="text-white ml-2">Auctions</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base mt-1">Handpicked deals from trusted sellers</p>
          </div>
          
          {/* Navigation arrows for desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <button 
              onClick={goToPrevSlide}
              className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={goToNextSlide}
              className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Auction cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {auctions.map((auction) => (
            <motion.div 
              key={auction.auction_id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <AuctionCard
                auction={auction}
                auctionCreator={auction.creator_name || "Anonymous"}
              />
            </motion.div>
          ))}
        </div>
        
        {/* View All Auctions link */}
        <div className="flex justify-center mt-8">
          <Link 
            href="/auctions/live"
            className="text-white text-sm font-medium flex items-center border-b border-gray-600 pb-1 hover:border-white transition-colors"
          >
            View All Auctions
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        {/* Mobile navigation arrows */}
        <div className="flex md:hidden justify-between items-center mt-6">
          <button 
            onClick={goToPrevSlide}
            className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={goToNextSlide}
            className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default LiveAuctionsSection;
