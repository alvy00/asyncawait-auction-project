import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export function DutchAuctionCard() {
  const controls = useAnimation();
  useEffect(() => {
    controls.start({ y: [0, 10, -10, 0], color: ["#16a34a", "#f59e42", "#ef4444", "#16a34a"] });
  }, [controls]);
  return (
    <motion.div
      className="rounded-2xl shadow-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-8 flex flex-col items-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div animate={controls} transition={{ repeat: Infinity, duration: 3 }} className="mb-4">
        <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="24" fill="#16a34a" fillOpacity="0.15" />
          <path d="M16 20h16M16 24h10M16 28h6" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M32 20c0-4.418-3.582-8-8-8s-8 3.582-8 8" stroke="#16a34a" strokeWidth="2.5" />
        </svg>
      </motion.div>
      <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">Dutch Auction</h3>
      <p className="text-gray-700 dark:text-gray-200 text-center mb-4">
        Starts high, price drops until someone buys. First to accept wins. Fast, fair, and exciting!
      </p>
      <motion.div
        className="text-3xl font-mono font-bold text-green-600 dark:text-green-300"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.2, 1], color: ["#16a34a", "#ef4444", "#16a34a"] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        $100 → $40
      </motion.div>
    </motion.div>
  );
} 