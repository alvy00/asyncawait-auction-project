import { motion } from "framer-motion";

export function BlitzAuctionCard() {
  return (
    <motion.div
      className="rounded-2xl shadow-xl bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 dark:from-fuchsia-900 dark:to-fuchsia-800 p-8 flex flex-col items-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 6, ease: "linear" }} className="mb-4">
        <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="24" fill="#a21caf" fillOpacity="0.15" />
          <circle cx="24" cy="24" r="12" stroke="#a21caf" strokeWidth="2.5" />
          <path d="M24 24v-8" stroke="#a21caf" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </motion.div>
      <h3 className="text-2xl font-bold text-fuchsia-800 dark:text-fuchsia-200 mb-2">Blitz Auction</h3>
      <p className="text-gray-700 dark:text-gray-200 text-center mb-4">
        Fast-paced, real-time bidding. Highest bid when the timer ends wins. Perfect for thrill-seekers!
      </p>
      <motion.div
        className="flex items-center gap-2 text-fuchsia-600 dark:text-fuchsia-300 font-mono text-2xl"
        animate={{ scale: [1, 1.15, 1], color: ["#a21caf", "#f472b6", "#a21caf"] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <span>00:10</span>
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M12 4v16M12 20l-4-4M12 20l4-4" stroke="#a21caf" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="font-bold">$320</span>
      </motion.div>
    </motion.div>
  );
} 