"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaQuestionCircle, FaBook, FaVideo, FaHeadset, FaArrowRight } from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";

// Sample help categories and articles
const HELP_CATEGORIES = [
  { id: 1, title: "Getting Started", icon: <FaBook className="text-blue-400" size={24} />, articles: 12 },
  { id: 2, title: "Account Management", icon: <FaHeadset className="text-purple-400" size={24} />, articles: 8 },
  { id: 3, title: "Auction Process", icon: <FaQuestionCircle className="text-green-400" size={24} />, articles: 15 },
  { id: 4, title: "Payments & Billing", icon: <FaHeadset className="text-amber-400" size={24} />, articles: 10 },
  { id: 5, title: "Security & Privacy", icon: <FaBook className="text-red-400" size={24} />, articles: 7 },
  { id: 6, title: "Video Tutorials", icon: <FaVideo className="text-teal-400" size={24} />, articles: 5 },
];

const POPULAR_ARTICLES = [
  { id: 1, title: "How to create a new auction", category: "Getting Started", views: 1245 },
  { id: 2, title: "Managing user permissions", category: "Account Management", views: 982 },
  { id: 3, title: "Understanding bid verification process", category: "Auction Process", views: 876 },
  { id: 4, title: "Setting up payment gateways", category: "Payments & Billing", views: 754 },
  { id: 5, title: "Two-factor authentication setup", category: "Security & Privacy", views: 698 },
];

const HelpCenterPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="text-white p-4 md:p-6 rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Help Center</h1>
          
          <div className="flex items-center space-x-2">
            <button 
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white font-medium hover:from-blue-700 hover:to-blue-900 transition-all duration-300 flex items-center gap-2"
              onClick={() => {}}
            >
              <FaHeadset size={16} />
              Contact Support
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <motion.div 
          className="mb-8 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full p-4 pl-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 focus:border-blue-500 focus:outline-none transition-all duration-300 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
          </div>
        </motion.div>

        {/* Help Categories */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HELP_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                className={`p-5 rounded-xl cursor-pointer transition-all duration-300 ${selectedCategory === category.id ? 'bg-gradient-to-br from-blue-900/80 to-purple-900/80' : 'bg-white/5 hover:bg-white/10'} backdrop-blur-md border border-white/10`}
                onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-white/10">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{category.title}</h3>
                    <p className="text-white/60 text-sm">{category.articles} articles</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Popular Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">Popular Articles</h2>
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
            {POPULAR_ARTICLES.map((article, index) => (
              <motion.div 
                key={article.id}
                className="p-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-all duration-300 cursor-pointer"
                whileHover={{ x: 5 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-white">{article.title}</h3>
                    <p className="text-white/60 text-sm">{article.category} • {article.views} views</p>
                  </div>
                  <FaArrowRight className="text-white/40 group-hover:text-white transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Video Tutorials Section */}
        <motion.div 
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4">Video Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item, index) => (
              <motion.div 
                key={item}
                className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 group cursor-pointer"
                whileHover={{ y: -5, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 relative flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-blue-500 transition-all duration-300">
                    <FaVideo className="text-white" size={20} />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg">Getting Started with Auctions</h3>
                  <p className="text-white/60 text-sm mt-1">Learn the basics of setting up and managing auctions</p>
                  <div className="flex items-center mt-3 text-sm text-white/60">
                    <span>5:32</span>
                    <span className="mx-2">•</span>
                    <span>1.2k views</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HelpCenterPage;