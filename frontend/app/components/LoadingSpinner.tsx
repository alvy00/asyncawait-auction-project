"use client"

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingSpinner = () => {
  const [bidAmount, setBidAmount] = useState(1000);
  const [showSold, setShowSold] = useState(false);
  
  // Simulate bidding animation
  useEffect(() => {
    const bidInterval = setInterval(() => {
      setBidAmount(prev => prev + Math.floor(Math.random() * 50) + 10);
    }, 300);
    
    // Show "SOLD!" animation periodically
    const soldInterval = setInterval(() => {
      setShowSold(true);
      setTimeout(() => setShowSold(false), 1000);
    }, 3000);
    
    return () => {
      clearInterval(bidInterval);
      clearInterval(soldInterval);
    };
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center  overflow-hidden relative">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -100 - 50],
              opacity: [0.2, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
      
      <div className="flex flex-col items-center z-10">
        {/* Auction gavel animation */}
        <div className="relative w-32 h-32 mb-6">
          <motion.div
            className="absolute w-20 h-4 bg-gradient-to-r from-amber-700 to-amber-900 rounded-md left-6 top-24"
            style={{ originX: 0.5, originY: 0 }}
          />
          
          <motion.div
            className="absolute w-8 h-24 bg-gradient-to-b from-amber-600 to-amber-800 rounded-md left-12 top-0"
            animate={{ rotateZ: [-20, 20, -20] }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              ease: "easeInOut",
              times: [0, 0.5, 1]
            }}
            style={{ originX: 0.5, originY: 1, transformOrigin: 'bottom center' }}
          >
            <motion.div 
              className="absolute w-12 h-8 bg-gradient-to-r from-amber-500 to-amber-700 rounded-md -left-2 top-0"
              style={{ borderRadius: '4px' }}
            />
          </motion.div>
          
          {/* Auction block */}
          <motion.div 
            className="absolute w-24 h-6 bg-gradient-to-r from-gray-700 to-gray-900 rounded-md left-4 bottom-0"
            animate={{ scale: [1, 0.98, 1] }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity,
              times: [0, 0.5, 1],
              ease: "easeInOut" 
            }}
          />
        </div>
        
        {/* Bidding amount */}
        <motion.div 
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 mb-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          ${bidAmount.toLocaleString()}
        </motion.div>
        
        {/* SOLD animation */}
        <AnimatePresence>
          {showSold && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute text-4xl font-extrabold text-red-500"
            >
              SOLD!
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Loading text */}
        <div className="relative mt-8">
          <p className="text-white text-lg">Loading ...</p>
          <motion.div 
            className="flex mt-1 justify-center"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {[0, 1, 2].map(i => (
              <motion.div 
                key={i}
                className="w-2 h-2 mx-1 bg-orange-500 rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ 
                  duration: 0.5, 
                  repeat: Infinity, 
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;