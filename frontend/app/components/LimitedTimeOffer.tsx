"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const STATIC_END_DATE_STRING = "2025-05-11T00:00:00Z"; // ✅ Static string to avoid hydration issues

const LimitedTimeOffer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: "--",
    hours: "--",
    minutes: "--",
    seconds: "--",
  });

  useEffect(() => {
    function calculateTimeLeft() {
      const now = new Date();
      const end = new Date(STATIC_END_DATE_STRING);
      const difference = end.getTime() - now.getTime();

      if (difference <= 0) {
        return { days: "00", hours: "00", minutes: "00", seconds: "00" };
      }

      return {
        days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, "0"),
        hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
        minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, "0"),
        seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
      };
    }

    const updateTimer = () => setTimeLeft(calculateTimeLeft());
    updateTimer(); // run once on mount
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
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
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                  <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold">
                    {value}
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
