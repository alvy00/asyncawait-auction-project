"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaPlus, FaSearch, FaFilter, FaEllipsisV, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";

// Sample auction data
const SAMPLE_AUCTIONS = [
  { id: "#1532", date: "Dec 20, 2023", creator: "Ajay Ahmad", product: "iPhone 14 pro", category: "electronics", startBid: "329.40", currentBid: "450.00", endDate: "Dec 25, 2023", status: "active" },
  { id: "#1531", date: "Dec 20, 2023", creator: "Manvir", product: "Vintage Camera", category: "electronics", startBid: "177.24", currentBid: "200.50", endDate: "Dec 30, 2023", status: "active" },
  { id: "#1530", date: "Dec 19, 2023", creator: "Shahriar Islam", product: "Designer Watch", category: "fashion", startBid: "513.10", currentBid: "750.00", endDate: "Dec 22, 2023", status: "active" },
  { id: "#1529", date: "Dec 18, 2023", creator: "Sohaan Khan", product: "Antique Vase", category: "art", startBid: "369.55", currentBid: "420.75", endDate: "Dec 28, 2023", status: "active" },
  { id: "#1528", date: "Dec 17, 2023", creator: "Amitav Hasan", product: "Gaming Laptop", category: "electronics", startBid: "1246.78", currentBid: "1500.00", endDate: "Dec 24, 2023", status: "active" },
  { id: "#1527", date: "Dec 15, 2023", creator: "Mustafa Khan", product: "Leather Jacket", category: "fashion", startBid: "164.20", currentBid: "185.00", endDate: "Dec 20, 2023", status: "ended" },
  { id: "#1526", date: "Dec 14, 2023", creator: "Rahul Dev", product: "Mountain Bike", category: "sports", startBid: "899.99", currentBid: "1050.00", endDate: "Dec 19, 2023", status: "ended" },
  { id: "#1525", date: "Dec 12, 2023", creator: "Priya Sharma", product: "Diamond Necklace", category: "jewelry", startBid: "2499.00", currentBid: "3200.00", endDate: "Dec 18, 2023", status: "ended" },
  { id: "#1524", date: "Dec 10, 2023", creator: "Michael Chen", product: "Drone Camera", category: "electronics", startBid: "799.50", currentBid: "950.25", endDate: "Dec 17, 2023", status: "ended" },
  { id: "#1523", date: "Dec 08, 2023", creator: "Sarah Wilson", product: "Handmade Pottery", category: "art", startBid: "129.99", currentBid: "175.50", endDate: "Dec 15, 2023", status: "ended" },
];

const AuctionsPage = () => {
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState(SAMPLE_AUCTIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const router = useRouter();

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter auctions based on search term and filters
  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = 
      auction.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auction.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || auction.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || auction.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDeleteAuction = (id: string) => {
    // In a real app, you would call an API to delete the auction
    toast.success(`Auction ${id} deleted successfully`);
    setAuctions(auctions.filter(auction => auction.id !== id));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className=" text-white p-4 md:p-6 rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Manage Auctions</h1>
          
          <Link href="/admin/auctions/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all duration-300"
            >
              <FaPlus size={14} />
              <span>Create Auction</span>
            </motion.button>
          </Link>
        </div>

        {/* Filters and Search Section */}
        <div className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/5 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search auctions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[150px]">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <FaFilter className="ml-3 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent border-none text-white py-2 pl-2 pr-8 w-full focus:outline-none focus:ring-0 appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0d1d33]">All Status</option>
                  <option value="active" className="bg-[#0d1d33]">Active</option>
                  <option value="ended" className="bg-[#0d1d33]">Ended</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="relative min-w-[150px]">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <FaFilter className="ml-3 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent border-none text-white py-2 pl-2 pr-8 w-full focus:outline-none focus:ring-0 appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0d1d33]">All Categories</option>
                  <option value="electronics" className="bg-[#0d1d33]">Electronics</option>
                  <option value="fashion" className="bg-[#0d1d33]">Fashion</option>
                  <option value="art" className="bg-[#0d1d33]">Art</option>
                  <option value="jewelry" className="bg-[#0d1d33]">Jewelry</option>
                  <option value="sports" className="bg-[#0d1d33]">Sports</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auctions Table */}
        <div className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Creator</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Start Bid</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Current Bid</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">End Date</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAuctions.length > 0 ? (
                  filteredAuctions.map((auction) => (
                    <motion.tr 
                      key={auction.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-white/5 transition-colors duration-150"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-md text-xs font-medium">
                          {auction.id}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-300">{auction.date}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">{auction.creator}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">{auction.product}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-300">
                        <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md text-xs">
                          {auction.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">${auction.startBid}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-green-400">${auction.currentBid}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-300">{auction.endDate}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${auction.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 p-2 rounded-lg transition-colors duration-200"
                            title="View Details"
                          >
                            <FaEye size={14} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 p-2 rounded-lg transition-colors duration-200"
                            title="Edit Auction"
                          >
                            <FaEdit size={14} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition-colors duration-200"
                            title="Delete Auction"
                            onClick={() => handleDeleteAuction(auction.id)}
                          >
                            <FaTrash size={14} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-6 text-center text-gray-400 italic">
                      No auctions found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="py-4 px-6 flex items-center justify-between border-t border-white/10">
            <div className="text-sm text-gray-400">
              Showing <span className="font-medium text-white">{filteredAuctions.length}</span> of <span className="font-medium text-white">{auctions.length}</span> auctions
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-white/5 hover:bg-white/10 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Previous
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200">
                Next
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuctionsPage;