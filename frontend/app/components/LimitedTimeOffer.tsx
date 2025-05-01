"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const LimitedTimeOffer = () => {
  // Set end date to 7 days from now
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  function calculateTimeLeft() {
    const difference = endDate.getTime() - new Date().getTime();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <section className="py-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white opacity-10 rounded-full"></div>
        <div className="absolute top-10 right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
        <div className="absolute bottom-10 left-1/3 w-20 h-20 bg-white opacity-10 rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between"
        >
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">Special Offer for New Bidders</h2>
            <p className="text-xl">Register now and get a $50 credit on your first auction win!</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex space-x-4 mb-4">
              <div className="flex flex-col items-center">
                <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold">
                  {timeLeft.days}
                </div>
                <span className="text-sm mt-1">Days</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold">
                  {timeLeft.hours}
                </div>
                <span className="text-sm mt-1">Hours</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold">
                  {timeLeft.minutes}
                </div>
                <span className="text-sm mt-1">Mins</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold">
                  {timeLeft.seconds}
                </div>
                <span className="text-sm mt-1">Secs</span>
              </div>
            </div>
            
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-orange-600 font-bold rounded-lg shadow-lg"
              >
                Claim Your $50 Credit
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LimitedTimeOffer;