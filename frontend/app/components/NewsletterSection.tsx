"use client";
import { motion } from "framer-motion";
import { Mail, Sparkles, Bell, Star, ArrowRight } from "lucide-react";
import { useState } from "react";

const BENEFITS = [
  {
    icon: <Sparkles className="w-6 h-6 text-pink-400" />,
    text: "Exclusive auction tips & strategies"
  },
  {
    icon: <Bell className="w-6 h-6 text-orange-400" />,
    text: "Early access to rare listings"
  },
  {
    icon: <Star className="w-6 h-6 text-yellow-400" />,
    text: "VIP-only flash sales & events"
  },
  {
    icon: <Mail className="w-6 h-6 text-blue-400" />,
    text: "No spam. Unsubscribe anytime."
  },
];

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setIsLoading(false);
    }, 1200);
  }

  return (
    <section className="py-24 relative overflow-hidden bg-[#0a0a18]">
      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
        {/* Left: Headline, subheadline, benefits */}
        <div className="flex-1 flex flex-col items-start justify-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-pink-500 to-orange-400 bg-clip-text text-transparent drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Join Our Free Auction Insider Newsletter
          </motion.h2>
          <motion.p
            className="text-lg md:text-2xl text-white/90 mb-8 max-w-xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Get exclusive tips, early access to rare auctions, and VIP-only deals—straight to your inbox. 100% free, always valuable.
          </motion.p>
          <div className="flex flex-wrap gap-3 mb-10">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.text}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 text-white/90 font-medium text-sm shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
              >
                {b.icon}
                <span>{b.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Right: Glassy email form */}
        <motion.div
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl flex flex-col gap-6"
          >
            {submitted ? (
              <motion.div
                className="text-center text-2xl font-bold text-green-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                🎉 You're in! Check your inbox soon.
              </motion.div>
            ) : (
              <>
                <label htmlFor="newsletter-email" className="text-white/80 text-lg font-semibold mb-2 flex items-center gap-2">
                  <Mail className="w-6 h-6 text-blue-400" />
                  Your Email
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@email.com"
                  className="w-full px-5 py-3 rounded-xl bg-white/20 border border-white/20 text-white text-lg placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-bold text-lg py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 mt-2"
                >
                  {isLoading ? (
                    <span className="animate-pulse">Joining...</span>
                  ) : (
                    <>
                      Join Free Newsletter <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <div className="text-xs text-white/60 mt-2 text-center">No spam. Unsubscribe anytime.</div>
              </>
            )}
          </form>
        </motion.div>
      </div>
      {/* Animated blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-500/20 rounded-full filter blur-[120px] animate-pulse-slow z-0" />
      <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] bg-purple-500/10 rounded-full filter blur-[80px] animate-float z-0" />
      <div className="absolute top-[30%] left-[10%] w-[200px] h-[200px] bg-blue-500/10 rounded-full filter blur-[60px] animate-float-delayed z-0" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0" />
    </section>
  );
} 