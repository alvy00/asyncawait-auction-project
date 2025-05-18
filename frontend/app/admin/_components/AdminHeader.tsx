"use client";

import { motion } from "framer-motion";

interface AdminHeaderProps {
  username: string;
}

const AdminHeader = ({ username }: AdminHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome back, <span className="text-[#ef863f]">{username}</span></h1>
        
        <div className="flex gap-2">
          <button className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-200">
            Export data
          </button>
          <button className="bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-200 shadow-lg shadow-orange-500/20">
            Create report
          </button>
        </div>
      </div>
      <p className="text-gray-400 text-sm">Measure your advertising ROI and report website traffic.</p>
    </motion.div>
  );
};

export default AdminHeader;