"use client";

import { useEffect, useState } from "react";
import AuctionCard from "../../../components/AuctionCard";
import { Auction } from "../../../../lib/interfaces";
import { FaSpinner, FaSearch, FaHistory, FaSortAmountDown } from "react-icons/fa";
import { motion } from "framer-motion";

const PastAuctionsPage = () => {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    // Categories for filter pills
    const categories = ["all", "watches", "jewelry", "art", "collectibles", "fashion"];

    // Sorting options
    const [sortBy, setSortBy] = useState("date"); // date, price, popularity

    // fetching past auctions
    useEffect(() => {
        const fetchPastAuctions = async () => {
            setIsLoading(true);
            try {
                
                const res = await fetch(
                    "https://asyncawait-auction-project.onrender.com/api/auctions",
                    {
                        method: "GET",
                        headers: {
                            "Content-type": "application/json",
                        },
                    }
                );

                if (!res.ok) {
                    const r = await res.json();
                    console.error(r.message || r.statusText);
                    return;
                }

                const data = await res.json();
                
                // Filter to only include ended auctions 
                const pastAuctions = data.filter((auction: Auction) => {
                    const endTime = new Date(auction.end_time);
                    return endTime < new Date();
                });
                
                setAuctions(pastAuctions);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPastAuctions();
    }, []);

    // Filter auctions based on search term and active filter
    const filteredAuctions = auctions.filter(auction => {
        const matchesSearch = auction.item_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === "all" || auction.category?.toLowerCase() === activeFilter;
        return matchesSearch && matchesFilter;
    });

    // Sort auctions based on selected sort option
    const sortedAuctions = [...filteredAuctions].sort((a, b) => {
        if (sortBy === "date") {
            return new Date(b.end_time).getTime() - new Date(a.end_time).getTime();
        } else if (sortBy === "price") {
            return b.highest_bid - a.highest_bid;
        } else { // popularity - could be based on number of bids
            return (b.bid_history?.length || 0) - (a.bid_history?.length || 0);
        }
    });

    // Animation variants for staggered children
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section className="py-16 min-h-screen relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 z-0">
                {/* Large gradient circle */}
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-500/10 rounded-full filter blur-[120px] animate-pulse-slow"></div>
                
                {/* Small accent circles */}
                <div className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] bg-purple-500/5 rounded-full filter blur-[80px] animate-float"></div>
                <div className="absolute top-[30%] left-[10%] w-[200px] h-[200px] bg-orange-500/5 rounded-full filter blur-[60px] animate-float-delayed"></div>
                
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
                {/* Hero section with animated title */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <motion.h1 
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Past Auctions</span>
                    </motion.h1>
                    <motion.p 
                        className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        Discover the final prices and winners of our previous auction items
                    </motion.p>
                </motion.div>

                {/* Search and filter section */}
                <motion.div 
                    className="mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    {/* Search bar */}
                    <div className="relative max-w-md mx-auto mb-6">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                            placeholder="Search past auctions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter and sort controls */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        {/* Filter pills */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {categories.map((category, index) => (
                                <motion.button
                                    key={category}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === category 
                                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20' 
                                        : 'bg-white/5 backdrop-blur-sm text-gray-300 hover:bg-white/10 border border-white/10'}`}
                                    onClick={() => setActiveFilter(category)}
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </motion.button>
                            ))}
                        </div>

                        {/* Sort dropdown */}
                        <motion.div 
                            className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <FaSortAmountDown className="text-gray-400" />
                            <select 
                                className="bg-transparent text-gray-300 focus:outline-none"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="date" className="bg-gray-800">End Date</option>
                                <option value="price" className="bg-gray-800">Final Price</option>
                                <option value="popularity" className="bg-gray-800">Popularity</option>
                            </select>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Auctions grid with staggered animation */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                            className="text-orange-500 mb-4"
                        >
                            <FaSpinner className="animate-spin h-12 w-12" />
                        </motion.div>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-gray-300 text-lg"
                        >
                            Loading auction history...
                        </motion.p>
                    </div>
                ) : sortedAuctions.length > 0 ? (
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {sortedAuctions.map((auction, index) => (
                            <motion.div
                                key={index}
                                className="hover:scale-105 transform transition-all duration-300 ease-in-out"
                                variants={itemVariants}
                            >
                                <AuctionCard auction={auction} auctionCreator={auction.creator} isFavourited={false}/>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        className="text-center py-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-block p-6 rounded-full bg-white/5 backdrop-blur-md mb-6">
                            <FaHistory className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No past auctions found</h3>
                        <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default PastAuctionsPage;

//  styles for animations
const styles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
  
  @keyframes float-delayed {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
  }
  
  @keyframes pulse-slow {
    0% { opacity: 0.5; }
    50% { opacity: 0.7; }
    100% { opacity: 0.5; }
  }
  
  .animate-float {
    animation: float 8s ease-in-out infinite;
  }
  
  .animate-float-delayed {
    animation: float-delayed 10s ease-in-out infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
  }
  
  .bg-grid-pattern {
    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
