"use client";
import { motion } from "framer-motion";

const BENEFITS = [
  {
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="#f59e42" fillOpacity="0.15" /><path d="M12 18l5 5 7-9" stroke="#f59e42" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
    title: "Buyer Protection",
    desc: "Your payments are secure and protected until you receive your item as described."
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="#6366f1" fillOpacity="0.15" /><path d="M18 10v8l5 3" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
    title: "24/7 Support",
    desc: "Get instant help from our expert team, anytime you need it."
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="#10b981" fillOpacity="0.15" /><path d="M12 18l3 3 9-9" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
    title: "Verified Sellers",
    desc: "All sellers are verified for authenticity and reliability."
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="#f472b6" fillOpacity="0.15" /><path d="M18 10v8l5 3" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
    title: "Easy Refunds",
    desc: "Simple, no-hassle refund policy for your peace of mind."
  }
];

export function WhyChooseUsSection() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-white mb-12 drop-shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Why Choose Us?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              className="rounded-2xl p-8 shadow-xl border border-white/10 bg-gradient-to-br from-white/5 via-white/2 to-white/0 backdrop-blur-xl flex flex-col items-center text-center relative overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="mb-4">{b.icon}</div>
              <div className="text-xl font-bold text-white mb-2">{b.title}</div>
              <div className="text-white/80 text-base">{b.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-orange-500/20 rounded-full filter blur-[100px] animate-pulse-slow z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[200px] h-[200px] bg-blue-500/10 rounded-full filter blur-[60px] animate-float z-0" />
    </section>
  );
} 