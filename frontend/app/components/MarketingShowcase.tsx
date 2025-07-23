import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function MarketingShowcase() {
  return (
    <section className="relative py-20 px-4 md:px-0  overflow-hidden flex flex-col items-center justify-center">
      {/* Subtle colored glows */}
      {/* <motion.div
        className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-cyan-700/20 rounded-full filter blur-[100px] z-0"
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 10 }}
      /> */}
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-orange-700/20 rounded-full filter blur-[120px] z-0"
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 12 }}
      />
      <motion.div
        className="absolute top-[30%] left-[50%] w-[200px] h-[200px] bg-purple-700/20 rounded-full filter blur-[80px] z-0"
        animate={{ x: [0, 30, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ repeat: Infinity, duration: 14 }}
      />
      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
        <motion.h2
          className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 mb-6 drop-shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Discover the Future of Auctions
        </motion.h2>
        <motion.p
          className="text-base md:text-xl text-white/90 mb-8 font-medium max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Lightning-fast bidding, real-time excitement, and unbeatable deals. Our next-gen auction platform brings together rare finds, passionate communities, and stunning live events—all in one seamless, secure, and beautiful interface.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Link href="/auctions/live">
            <Button size="lg" className="rounded-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white px-8 py-3 text-lg shadow-lg">
              Explore Live Auctions
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="rounded-full border-cyan-400 text-cyan-200 bg-cyan-900/10 hover:bg-cyan-900/20 hover:text-white px-8 py-3 text-lg">
              Join the Action
            </Button>
          </Link>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Feature 1 */}
          <motion.div
            className="backdrop-blur-lg bg-white/5 border border-cyan-800/30 rounded-2xl p-6 shadow-lg flex flex-col items-center min-h-[180px]"
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <span className="text-3xl mb-2 text-cyan-300">⚡</span>
            <span className="text-lg font-bold text-cyan-100 mb-1">Real-Time Bidding</span>
            <span className="text-white/80 text-base">Bid live with instant updates and zero lag. Never miss your chance to win.</span>
          </motion.div>
          {/* Feature 2 */}
          <motion.div
            className="backdrop-blur-lg bg-white/5 border border-orange-800/30 rounded-2xl p-6 shadow-lg flex flex-col items-center min-h-[180px]"
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <span className="text-3xl mb-2 text-orange-300">🎁</span>
            <span className="text-lg font-bold text-orange-100 mb-1">Exclusive Finds</span>
            <span className="text-white/80 text-base">Access rare items, collectibles, and flash deals you won't find anywhere else.</span>
          </motion.div>
          {/* Feature 3 */}
          <motion.div
            className="backdrop-blur-lg bg-white/5 border border-purple-800/30 rounded-2xl p-6 shadow-lg flex flex-col items-center min-h-[180px]"
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <span className="text-3xl mb-2 text-purple-300">🔒</span>
            <span className="text-lg font-bold text-purple-100 mb-1">Secure & Trusted</span>
            <span className="text-white/80 text-base">Your privacy and security are our top priority. Bid with confidence, always.</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 