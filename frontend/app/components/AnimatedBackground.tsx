"use client";

import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Orange/red gradient bubble - top right */}
      <motion.div 
        className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-700 rounded-full filter blur-[80px] opacity-30"
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{
          x: [0, 30, -20, 10, 0],
          y: [0, -20, 30, -10, 0],
          scale: [1, 1.05, 0.98, 1.02, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      
      {/* Smaller orange accent - mid right */}
      <motion.div 
        className="absolute top-[30%] right-[-5%] w-[300px] h-[300px] bg-orange-700 rounded-full filter blur-[60px] opacity-20"
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{
          x: [0, -40, 20, -10, 0],
          y: [0, 30, -20, 10, 0],
          scale: [1, 0.95, 1.05, 0.98, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      {/* Dark accent bubble - bottom left */}
      <motion.div 
        className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-gray-800 rounded-full filter blur-[70px] opacity-50"
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{
          x: [0, 50, -30, 15, 0],
          y: [0, -40, 20, -10, 0],
          scale: [1, 1.1, 0.95, 1.03, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 4
        }}
      />
      
      {/* Orange accent - bottom right */}
      <motion.div 
        className="absolute bottom-[5%] right-[20%] w-[350px] h-[350px] bg-orange-600 rounded-full filter blur-[70px] opacity-20"
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{
          x: [0, -30, 40, -20, 0],
          y: [0, 20, -30, 15, 0],
          scale: [1, 0.9, 1.08, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 3
        }}
      />
      
      {/* New subtle purple accent - top left */}
      <motion.div 
        className="absolute top-[15%] left-[5%] w-[250px] h-[250px] bg-purple-500 rounded-full filter blur-[80px] opacity-10"
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{
          x: [0, 25, -35, 15, 0],
          y: [0, -25, 35, -15, 0],
          scale: [1, 1.1, 0.9, 1.05, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 1
        }}
      />
    </div>
  );
};

export { AnimatedBackground };
