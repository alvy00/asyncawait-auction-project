/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

export interface AuctionCardProps {
  id: string | number;
  title: string;
  description?: string;
  currentBid: number;
  endTime: Date | string;
  image: string;
  category?: string;
  seller?: string;
  isLive?: boolean;
  className?: string;
  onBid?: (id: string | number) => void;
  onFavorite?: (id: string | number, isFavorite: boolean) => void;
  isFavorite?: boolean;
}

const formatTimeLeft = (endTime: Date | string): string => {
  const end = new Date(endTime);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return 'Ended';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
};

const AuctionCard: React.FC<AuctionCardProps> = ({
  id,
  title,
  description,
  currentBid,
  endTime,
  image,
  category,
  seller,
  isLive = false,
  className,
  onBid,
  onFavorite,
  isFavorite: initialFavorite = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(endTime));
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(formatTimeLeft(endTime));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [endTime]);
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !isFavorite;
    setIsFavorite(newState);
    if (onFavorite) {
      onFavorite(id, newState);
    }
  };
  
  const handleBidClick = () => {
    if (onBid) {
      onBid(id);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative overflow-hidden rounded-xl bg-transparent backdrop-blur-3xl shadow-lg hover:shadow-xl transition-all duration-300",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container with zoom effect */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image 
          src={image} 
          alt={title}
          fill
          className={cn(
            "object-cover transition-transform duration-700",
            isHovered ? "scale-110" : "scale-100"
          )}
        />
        
        {/* Live tag */}
        {isLive && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-light px-3 py-1 z-10 rounded-lg">
            Live
          </div>
        )}
        
        {/* Favorite button */}
        <AnimatePresence>
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-2 rounded-full z-10"
            >
              {isFavorite ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      {/* Content with glass background effect */}
      <div className="p-6 pb-0  relative z-10">
        <h3 className="text-white text-2xl font-bold mb-2">{title}</h3>
        
        <div className="text-gray-400 text-sm mb-1">
          Current bid:
        </div>
        
        {/* Price and time - better spacing */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-white font-bold text-4xl">
            ${currentBid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-white text-lg">
            {timeLeft}
          </div>
        </div>

        {/* Seller and bid button - with orange border button */}
        <div className="flex items-center justify-between">
          {seller && (
            <div className="flex items-center text-white text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {seller}
            </div>
          )}
          <Button 
            onClick={handleBidClick}
            className="bg-transparent hover:bg-orange-600/20 text-white border border-orange-500 rounded-md transition-all duration-300"
            variant="outline"
          >
            Bid Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AuctionCard;