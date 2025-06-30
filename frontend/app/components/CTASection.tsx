"use client";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-white mb-6 drop-shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Ready to Start?
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl text-white/80 text-center mb-10 max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Join thousands of buyers and sellers on AsyncAwait Auction. Discover unique items, sell with confidence, and experience the future of online auctions.
        </motion.p>
        <div className="flex flex-wrap gap-6 justify-center">
          <Link href="/auctions/create">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25">
              Start Selling
            </Button>
          </Link>
          <Link href="/auctions/live">
            <Button size="lg" variant="outline" className="border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105">
              Start Bidding
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-orange-500/20 rounded-full filter blur-[100px] animate-pulse-slow z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[200px] h-[200px] bg-blue-500/10 rounded-full filter blur-[60px] animate-float z-0" />
    </section>
  );
}