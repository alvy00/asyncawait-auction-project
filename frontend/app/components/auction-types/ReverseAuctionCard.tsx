import { motion } from "framer-motion";

export function ReverseAuctionCard() {
  return (
    <motion.div
      className="rounded-2xl shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-8 flex flex-col items-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mb-4">
        <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="24" fill="#2563eb" fillOpacity="0.15" />
          <path d="M24 16v16M24 32l-6-6M24 32l6-6" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </motion.div>
      <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">Reverse Auction</h3>
      <p className="text-gray-700 dark:text-gray-200 text-center mb-4">
        Sellers compete to offer the lowest price. Buyer picks the best deal. Perfect for services and jobs!
      </p>
      <motion.div
        className="flex gap-2 items-center text-blue-600 dark:text-blue-300 font-mono text-2xl"
        animate={{ x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="line-through">$100</span>
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M12 4v16M12 20l-4-4M12 20l4-4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>$60</span>
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M12 4v16M12 20l-4-4M12 20l4-4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="font-bold">$40</span>
      </motion.div>
    </motion.div>
  );
} 