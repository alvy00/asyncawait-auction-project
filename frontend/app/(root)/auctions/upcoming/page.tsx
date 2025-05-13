"use client";

import { useEffect, useState } from "react";
import AuctionCard from "../../../components/AuctionCard";
import { Auction } from "../../../../lib/interfaces";
import { FaSpinner, FaSearch, FaFilter, FaSortAmountUp, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const UpcomingAuctionsPage = () => {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    // Categories for filter pills
    const categories = ["all", "watches", "jewelry", "art", "collectibles", "fashion"];

    // fetching upcoming auctions
    useEffect(() => {
        const fetchUpcomingAuctions = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(
                    "https://asyncawait-auction-project.onrender.com/api/auctions/upcoming",
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
                setAuctions(data);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUpcomingAuctions();
    }, []);

    // Filter auctions based on search term and active filter
    const filteredAuctions = auctions.filter(auction => {
        const matchesSearch = auction.item_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === "all" || auction.category?.toLowerCase() === activeFilter;
        return matchesSearch && matchesFilter;
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
        <>
            <section className="py-16 min-h-screen relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 z-0">
                    {/* Large gradient circle */}
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-500/10 rounded-full filter blur-[120px] animate-pulse-slow"></div>
                    
                    {/* Small accent circles */}
                    <div className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] bg-purple-500/5 rounded-full filter blur-[80px] animate-float"></div>
                    <div className="absolute top-[30%] left-[10%] w-[200px] h-[200px] bg-blue-500/5 rounded-full filter blur-[60px] animate-float-delayed"></div>
                    
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
                            className="text-4xl md:text-5xl font-bold text-white mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Auctions</span>
                        </motion.h1>
                        <motion.p 
                            className="text-gray-300 max-w-2xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            Discover exclusive items before they go live. Set reminders and be the first to bid on these upcoming treasures.
                        </motion.p>
                    </motion.div>
                    
                    {/* Search and filter section */}
                    <div className="mb-10">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            {/* Search bar */}
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search upcoming auctions..."
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            {/* Sort button */}
                            <button className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white hover:bg-gray-700/50 transition-all duration-300">
                                <FaSortAmountUp />
                                <span>Sort</span>
                            </button>
                            
                            {/* Filter button */}
                            <button className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white hover:bg-gray-700/50 transition-all duration-300">
                                <FaFilter />
                                <span>Filter</span>
                            </button>
                        </div>
                        
                        {/* Category filter pills */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === category ? 'bg-orange-500 text-white' : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50'}`}
                                    onClick={() => setActiveFilter(category)}
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Auctions grid with loading state */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <FaSpinner className="animate-spin text-orange-500 text-4xl" />
                        </div>
                    ) : filteredAuctions.length > 0 ? (
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {filteredAuctions.map((auction) => {
                                // Find the auction creator
                                const auctionCreator = auction.creator_name || "Anonymous";
                                
                                return (
                                    <motion.div key={auction.auction_id} variants={itemVariants}>
                                        <AuctionCard 
                                            auction={auction} 
                                            auctionCreator={auctionCreator} 
                                        />
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <div className="text-center py-20 bg-gray-800/30 rounded-xl border border-gray-700">
                            <FaCalendarAlt className="mx-auto text-4xl text-gray-500 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No upcoming auctions found</h3>
                            <p className="text-gray-400">Try adjusting your filters or check back later for new items</p>
                        </div>
                    )}
                </div>
            </section>
            
            {/* Add custom animations */}
            <style jsx global>{`
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
                    0% { opacity: 0.3; }
                    50% { opacity: 0.5; }
                    100% { opacity: 0.3; }
                }
                
                .animate-float {
                    animation: float 15s ease-in-out infinite;
                }
                
                .animate-float-delayed {
                    animation: float-delayed 12s ease-in-out infinite;
                    animation-delay: 2s;
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 10s ease-in-out infinite;
                }
                
                .bg-grid-pattern {
                    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
            `}</style>
        </>
    );
};

export default UpcomingAuctionsPage;