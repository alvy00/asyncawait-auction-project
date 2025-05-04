/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// ✅ Static end date to avoid hydration mismatch
const STATIC_END_DATE = new Date("2025-05-11T00:00:00Z");

const LimitedTimeOffer = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();
    const difference = STATIC_END_DATE.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white overflow-hidden relative">
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
              {["days", "hours", "minutes", "seconds"].map((unit) => (
                <div key={unit} className="flex flex-col items-center">
                  <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold">
                    {String((timeLeft as any)[unit]).padStart(2, "0")}
                  </div>
                  <span className="text-sm mt-1 capitalize">{unit}</span>
                </div>
              ))}
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
