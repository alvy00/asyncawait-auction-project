"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../components/ui/button";

export default function NotFound() {
  // Auction countdown timer state
  const [timeLeft, setTimeLeft] = useState("00h 00m 00s");
  const [bidAmount, setBidAmount] = useState(404);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Simulate auction countdown
  useEffect(() => {
    const endTime = new Date(Date.now() + 3600000 * 24); // 24 hours from now
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Generate random bidder names
  const bidderNames = [
    "Lost Navigator", 
    "Error Hunter", 
    "Phantom Bidder", 
    "Void Collector", 
    "Glitch Seeker",
    "404 Finder",
    "Missing Page",
    "Broken Link"
  ];
  
  // Simulate bidding animation with bid history
  useEffect(() => {
    if (!hasAnimated) {
      const interval = setInterval(() => {
        setBidAmount(prev => {
          const increase = Math.floor(Math.random() * 10) + 1;
          const newAmount = prev + increase;
          
          // Add to bid history
          if (bidHistory.length < 5) {
            const randomBidder = bidderNames[Math.floor(Math.random() * bidderNames.length)];
            setBidHistory(prevHistory => [
              { bidder: randomBidder, amount: newAmount, increase },
              ...prevHistory
            ]);
          }
          
          if (newAmount >= 500) {
            clearInterval(interval);
            setHasAnimated(true);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
            return 500;
          }
          return newAmount;
        });
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [hasAnimated, bidHistory.length]);

  // Confetti effect
  const confettiColors = ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee'];
  const confettiElements = Array.from({ length: 100 }).map((_, index) => {
    const size = Math.random() * 10 + 5;
    const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    const left = Math.random() * 100;
    const animationDuration = Math.random() * 3 + 2;
    const delay = Math.random() * 0.5;
    
    return (
      <motion.div
        key={index}
        initial={{ y: -20, opacity: 0 }}
        animate={showConfetti ? { 
          y: ['0vh', '100vh'],
          opacity: [1, 1, 0],
          rotate: [0, 360 * Math.random() > 0.5 ? 1 : -1]
        } : { y: -20, opacity: 0 }}
        transition={{ 
          duration: animationDuration, 
          delay: delay,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: `${left}%`,
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          zIndex: 50
        }}
      />
    );
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-8 md:py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        {/* Large gradient circle */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-orange-500/20 rounded-full filter blur-[120px] animate-pulse-slow"></div>
        
        {/* Small accent circles */}
        <div className="absolute bottom-[10%] left-[5%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-purple-500/10 rounded-full filter blur-[80px] animate-float"></div>
        <div className="absolute top-[30%] left-[10%] w-[150px] h-[150px] md:w-[200px] md:h-[200px] bg-blue-500/10 rounded-full filter blur-[60px] animate-float-delayed"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      
      {/* Confetti effect */}
      {confettiElements}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* 404 Auction Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20 group"
          >
            {/* Glassmorphism card highlights */}
            <div className="absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl">
              <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-blue-500/10 opacity-30 group-hover:opacity-40 transition-opacity duration-700"></div>
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/5 to-transparent rotate-12 transform scale-2 opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
            </div>
            
            {/* Image container with zoom effect */}
            <div className="relative h-[300px] sm:h-[350px] overflow-hidden">
              <Image 
                src="/404-auction.jpg" 
                alt="404 Auction Item Not Found"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.src = "/fallback.jpg";
                }}
              />
              
              {/* Glass overlay on image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
              
              {/* 404 tag with animated pulse */}
              <motion.div 
                className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-medium px-2 sm:px-4 py-0.5 sm:py-1 z-10 rounded-lg flex items-center space-x-1 sm:space-x-2 shadow-lg backdrop-blur-sm"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-pulse"></span>
                <span>404 ERROR</span>
              </motion.div>
              
              {/* SOLD OUT stamp */}
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-red-500 rounded-md px-4 py-2 rotate-12 z-20"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: [1, 1.1, 1] }}
                transition={{ delay: 1, duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
              >
                <span className="text-red-500 font-bold text-2xl sm:text-4xl tracking-wider">LOST</span>
              </motion.div>
              
              {/* Hammer animation */}
              <motion.div 
                className="absolute bottom-4 right-4 transform origin-bottom-right"
                initial={{ rotate: -45, y: -50 }}
                animate={{ rotate: 0, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  duration: 1.5,
                  repeatDelay: 2
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 sm:h-24 sm:w-24 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v10m0 4v4M3 12h4m10 0h4" />
                  <rect x="9" y="9" width="6" height="6" rx="1" strokeWidth={1.5} />
                </svg>
              </motion.div>
            </div>
            
            {/* Content with glass background effect */}
            <div className="p-3 sm:p-6 md:p-8 bg-gradient-to-b from-black/50 via-black/70 to-black/80 backdrop-blur-md relative z-10 border-t border-white/10">
              <div className="text-center">
                <motion.h1 
                  className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  AUCTION ITEM NOT FOUND
                </motion.h1>
                <motion.p 
                  className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  This lot appears to have been sold, removed, or never existed in our catalog.
                </motion.p>
                
                <div className="text-gray-400 text-xs sm:text-sm mb-1">
                  Last known bid:
                </div>
              </div>
              
              {/* Bid history section */}
              <div className="mb-4 bg-black/30 rounded-lg p-3 max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <AnimatePresence>
                  {bidHistory.map((bid, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex justify-between items-center mb-2 text-xs sm:text-sm"
                    >
                      <span className="text-gray-400">{bid.bidder}</span>
                      <div className="flex items-center">
                        <span className="text-white">${bid.amount.toFixed(2)}</span>
                        <span className="text-green-500 ml-2">+${bid.increase.toFixed(2)}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {/* Price and time */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8">
                <motion.div 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500 font-bold text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  ${bidAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </motion.div>
                <motion.div 
                  className="text-white text-sm sm:text-base bg-white/5 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Time until deletion: {timeLeft}</span>
                </motion.div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link href="/" passHref>
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
                  >
                    Return to Auction House
                  </Button>
                </Link>
                
                <Link href="/auctions/live" passHref>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Browse Live Auctions
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
          
          {/* Auction gavel animation */}
          <motion.div 
            className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 opacity-50"
            initial={{ rotate: -45 }}
            animate={{ rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 1.5,
              repeatDelay: 2
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}