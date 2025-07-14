/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from "../../components/ui/button";
import { Auction } from '../../lib/interfaces';
import StatusBadge from './StatusBadge';

export const HeroSection = () => {
  const [featuredAuctions, setFeaturedAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // fetch featured auctions
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('https://asyncawait-auction-project.onrender.com/api/auctions/featured');
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) {
          console.error('Error fetching featured auctions:', data);
          return;
        }
        setFeaturedAuctions(data);
      } catch (e) {
        console.error('Fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  // set index
  useEffect(() => {
    if (!featuredAuctions?.length) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % featuredAuctions.length);
    }, 8000);
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [featuredAuctions]);

  // countdown
  useEffect(() => {
    if (!featuredAuctions?.length) return;
    const updateTime = () => {
      const auction = featuredAuctions[activeIndex];
      if (!auction) return;
      const end = new Date(auction.end_time);
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("Auction Ended");
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [activeIndex, featuredAuctions]);

  // index func
  const nextCard = () => {
    setActiveIndex(prev => (prev + 1) % featuredAuctions.length);
  };
  const prevCard = () => {
    setActiveIndex(prev => (prev - 1 + featuredAuctions.length) % featuredAuctions.length);
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden py-8 md:py-12">
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
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left content - Text and CTA */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium mb-4 sm:mb-6"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
              Live Auctions Available Now
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-4"
            >
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Exclusive</span> Auction Treasures
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-gray-300 mt-4 sm:mt-6 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Join our community of 10,000+ collectors and bid on premium items with complete buyer protection and real-time updates.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 justify-center lg:justify-start"
            >
              {/* Feature badges with improved styling */}
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10">
                <div className="bg-orange-500 p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white text-xs sm:text-sm">Premium Items</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10">
                <div className="bg-orange-500 p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white text-xs sm:text-sm">Instant Support</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10">
                <div className="bg-orange-500 p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white text-xs sm:text-sm">Easy Refund Policy</span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-6 text-sm sm:text-base rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
              >
                Start Bidding Now
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-6 text-sm sm:text-base rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Explore Categories
              </Button>
            </motion.div>
          </div>
          
          {/* Right content - Card deck with optimized mobile animation */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-[280px] xs:max-w-[320px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-full h-[400px] sm:h-[450px] md:h-[500px] flex items-center justify-center bg-black/30 rounded-xl border border-white/20">
              {/* Show skeleton loading */}
              {loading && 
                <div className="w-full rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse space-y-4 backdrop-blur-sm shadow-inner">
                  <div className="h-95 bg-gray-700/30 rounded-md"></div>
                  <div className="h-4 bg-gray-600/30 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-500/20 rounded w-1/2"></div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="h-4 w-20 bg-gray-500/30 rounded"></div>
                    <div className="h-4 w-10 bg-gray-500/20 rounded"></div>
                  </div>
                </div>
              }

              {/* Show no auctions message */}
              {!loading && !featuredAuctions?.length && (
                <div className="text-white text-center px-4">
                  <h2 className="text-2xl font-bold mb-2">No Featured Auctions</h2>
                  <p className="text-gray-400">Check back later or explore other listings.</p>
                </div>
              )}

              {/* Show cards carousel only if auctions available */}
              {!loading && featuredAuctions?.length > 0 && (
                <>
                  {/* Card navigation controls */}
                  <div className="absolute top-1/2 -translate-y-1/2 -left-2 sm:-left-6 z-30">
                    <button
                      onClick={prevCard}
                      className="bg-black/30 hover:bg-black/50 backdrop-blur-md text-white p-3 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 touch-manipulation"
                      aria-label="Previous card"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  </div>

                  <div className="absolute top-1/2 -translate-y-1/2 -right-2 sm:-right-6 z-30">
                    <button
                      onClick={nextCard}
                      className="bg-black/30 hover:bg-black/50 backdrop-blur-md text-white p-3 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 touch-manipulation"
                      aria-label="Next card"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Card indicators */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
                    {featuredAuctions.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`h-2.5 rounded-full transition-all duration-300 touch-manipulation ${
                          index === activeIndex ? 'bg-orange-500 w-6' : 'bg-white/30 w-2.5'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Card deck */}
                  <div className="relative w-full h-full will-change-transform">
                    <AnimatePresence initial={false} mode="popLayout">
                      {featuredAuctions.map((auction, index) => {
                        const isActive = index === activeIndex;
                        const isNext = index === (activeIndex + 1) % featuredAuctions.length;
                        const isNextNext = index === (activeIndex + 2) % featuredAuctions.length;

                        if (!isActive && !isNext && !isNextNext) {
                          return null;
                        }

                        const zIndex = isActive ? 20 : isNext ? 10 : 5;
                        const scale = isActive ? 1 : isNext ? 0.95 : 0.9;
                        const translateY = isActive ? 0 : isNext ? 15 : 30;
                        const opacity = isActive ? 1 : isNext ? 0.7 : 0.5;

                        return (
                          <motion.div
                            key={auction.auction_id}
                            initial={{ scale: 0.9, y: 40, opacity: 0 }}
                            animate={{ scale, y: translateY, opacity, zIndex }}
                            exit={{ scale: 0.9, y: -40, opacity: 0, zIndex: 30, transition: { duration: 0.3, ease: "easeInOut" } }}
                            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                            style={{ position: 'absolute', width: '100%', height: '100%', transformOrigin: 'center center', willChange: 'transform, opacity', boxShadow: isActive ? '0 15px 30px -10px rgba(0, 0, 0, 0.5)' : 'none' }}
                            className={`${isActive ? 'pointer-events-auto' : 'pointer-events-none'} transform-gpu`}
                          >
                            {/* Card content */}
                            <div className="relative h-full overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/10 via-white/7 to-white/5 backdrop-blur-md shadow-2xl border border-white/20 group">
                              {/* Simplified glassmorphism effects for better mobile performance */}
                              <div className="absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-blue-500/10 opacity-30 group-hover:opacity-40 transition-opacity duration-500"></div>
                              </div>
                              
                              {/* Image container with optimized zoom effect */}
                              <div className="relative h-[55%] overflow-hidden">
                                <Image 
                                  src={auction.images?.[0]?.trim() ? auction.images[0] : "/fallback.jpg"}
                                  alt={auction.item_name} 
                                  fill
                                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw" // Responsive image sizing
                                  className="object-cover transition-transform duration-700 group-hover:scale-110 transform-gpu" // Added transform-gpu
                                  priority={isActive}
                                  loading="eager" // Ensure images load quickly
                                  quality={isActive ? 85 : 75} // Lower quality for background cards
                                />
                                
                                {/* Glass overlay on image */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                                
                                {/* Live tag */}
                                <StatusBadge auctionId={auction.auction_id} type={auction.auction_type} status={auction.status} participantCount={auction.participants} />
                                
                                {/* Favorite button - Improved touch target */}
                                <button className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 sm:p-2 rounded-full z-10 transition-all duration-300 hover:scale-110 border border-white/20 shadow-lg touch-manipulation">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                </button>
                              </div>
                              
                              {/* Content with refined glass background effect for readability and elegance */}
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="h-[55%] p-4 md:p-6 bg-black/90 backdrop-blur-md border-t border-white/15 rounded-b-xl shadow-xl flex flex-col justify-between relative z-10"
                              >
                                <div>
                                  <h3 className="text-white text-base sm:text-lg md:text-2xl font-bold mb-0.5 sm:mb-1">{auction.item_name}</h3>
                                  <p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3">{auction.item_name}</p>
                                  
                                  <div className="text-gray-400 text-xs sm:text-sm mb-1">
                                    Current bid:
                                  </div>
                                </div>
                                
                                {/* Price and time */}
                                <div className="flex-grow">
                                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500 font-bold text-xl sm:text-2xl md:text-3xl">
                                    {auction.auction_type !== "phantom" 
                                        ? `$${auction.highest_bid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        : `${auction.total_bids} bids already`
                                    }
                                    </div>
                                    <div className="text-white text-sm sm:text-base bg-white/5 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10">
                                      {isActive ? timeLeft : ''}
                                    </div>
                                  </div>

                                  {/* Seller and bid button */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center text-white text-xs sm:text-sm bg-white/5 backdrop-blur-sm px-2 py-1 rounded-lg">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                      {auction.creator}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats counter - mobile optimized */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-8"
        >
          {[
            { label: "Active Auctions", value: "10,000+" },
            { label: "Registered Bidders", value: "50,000+" },
            { label: "Items Sold", value: "125,000+" },
            { label: "Satisfaction Rate", value: "99.8%" }
          ].map((stat, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl p-2 sm:p-4 text-center">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-0 sm:mb-1">{stat.value}</div>
              <div className="text-gray-400 text-xs sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Add custom styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes float-delayed {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes pulse-slow {
          0% { opacity: 0.5; }
          50% { opacity: 0.7; }
          100% { opacity: 0.5; }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </section>
  );
};