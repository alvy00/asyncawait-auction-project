"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AuctionCard from '@/components/AuctionCard';
import { motion } from 'framer-motion';

// Sample auction data matching the image
const auctions = [
  {
    id: 1,
    title: "ROLEX Submariner 2020 Edition (Condition - 100% Fresh)",
    currentBid: 550.00,
    endTime: new Date(Date.now() + 3600000 * 2 + 900000 + 43000), // 2h 15m 43s from now
    image: "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    seller: "Weston Bennett",
    isLive: true
  },
  {
    id: 2,
    title: "Canon EOS 90D DSLR Camera (Body + 18-135mm Lens)",
    currentBid: 645.00,
    endTime: new Date(Date.now() + 3600000 * 2 + 900000 + 43000), // 2h 15m 43s from now
    image: "https://images.unsplash.com/photo-1520991459559-9b3b6ec6a52b?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    seller: "Egans Lab",
    isLive: true
  },
  {
    id: 3,
    title: "Toyota Corolla SE 2020 – Automatic – Petrol",
    currentBid: 8400.00,
    endTime: new Date(Date.now() + 3600000 * 2 + 900000 + 43000), // 2h 15m 43s from now
    image: "https://images.unsplash.com/photo-1638618164682-12b986ec2a75?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    seller: "Jhon Smith",
    isLive: true
  },
  // Add more items as needed
];

const LiveAuctionsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const maxVisibleItems = 3; // Maximum number of items visible at once
  const totalSlides = Math.ceil(auctions.length / maxVisibleItems);
  
  // Handle bid action
  const handleBid = (id: string | number) => {
    console.log(`Placing bid on item ${id}`);
    // Implement bid functionality here
  };
  
  // Navigation functions
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };
  
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };
  
  return (
    <section className="py-12 md:py-16  relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header with title and subtitle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              <span className="text-white">Featured</span>
              <span className="text-white ml-2">Auction</span>
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
            <div key={auction.id} className="bg-[#1a1f2a] rounded-lg overflow-hidden">
              <AuctionCard
                id={auction.id}
                title={auction.title}
                currentBid={auction.currentBid}
                endTime={auction.endTime}
                image={auction.image}
                seller={auction.seller}
                isLive={auction.isLive}
                onBid={handleBid}
                className="h-full"
              />
              
              {/* Custom bid button and seller info at the bottom of each card */}
              <div className="p-4 pt-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-gray-400 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {auction.seller}
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleBid(auction.id)}
                  className="w-full bg-transparent hover:bg-gray-700 text-white border border-gray-600 transition-all duration-300"
                >
                  Bid Now
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Action link */}
        <div className="flex justify-center mt-8">
          <Link 
            href="/auctions"
            className="text-white text-sm font-medium flex items-center border-b border-gray-600 pb-1 hover:border-white transition-colors"
          >
            View All Action
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
