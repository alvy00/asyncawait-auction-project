"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaSearch, FaFilter, FaEye, FaGavel, FaCheck, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";

// Sample bids data
const SAMPLE_BIDS = [
  { id: "#B1001", date: "Dec 20, 2023 14:30", bidder: "Ajay Ahmad", auction: "iPhone 14 Pro", amount: "$450.00", previousBid: "$425.00", status: "winning", auctionEnds: "Dec 25, 2023" },
  { id: "#B1002", date: "Dec 20, 2023 13:45", bidder: "Manvir Singh", auction: "Vintage Camera", amount: "$200.50", previousBid: "$185.25", status: "winning", auctionEnds: "Dec 30, 2023" },
  { id: "#B1003", date: "Dec 19, 2023 16:20", bidder: "Shahriar Islam", auction: "Designer Watch", amount: "$750.00", previousBid: "$720.00", status: "outbid", auctionEnds: "Dec 22, 2023" },
  { id: "#B1004", date: "Dec 19, 2023 11:15", bidder: "Sohaan Khan", auction: "Antique Vase", amount: "$420.75", previousBid: "$400.00", status: "winning", auctionEnds: "Dec 28, 2023" },
  { id: "#B1005", date: "Dec 18, 2023 09:30", bidder: "Amitav Hasan", auction: "Gaming Laptop", amount: "$1500.00", previousBid: "$1450.00", status: "winning", auctionEnds: "Dec 24, 2023" },
  { id: "#B1006", date: "Dec 17, 2023 17:45", bidder: "Mustafa Khan", auction: "Leather Jacket", amount: "$185.00", previousBid: "$175.50", status: "won", auctionEnds: "Dec 20, 2023" },
  { id: "#B1007", date: "Dec 16, 2023 14:10", bidder: "Rahul Dev", auction: "Mountain Bike", amount: "$1050.00", previousBid: "$1000.00", status: "won", auctionEnds: "Dec 19, 2023" },
  { id: "#B1008", date: "Dec 15, 2023 10:30", bidder: "Priya Sharma", auction: "Diamond Necklace", amount: "$3200.00", previousBid: "$3000.00", status: "won", auctionEnds: "Dec 18, 2023" },
  { id: "#B1009", date: "Dec 14, 2023 13:20", bidder: "Michael Chen", auction: "Drone Camera", amount: "$950.25", previousBid: "$900.00", status: "lost", auctionEnds: "Dec 17, 2023" },
  { id: "#B1010", date: "Dec 13, 2023 15:45", bidder: "Sarah Wilson", auction: "Handmade Pottery", amount: "$175.50", previousBid: "$150.00", status: "lost", auctionEnds: "Dec 15, 2023" },
];

const BidsPage = () => {
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState(SAMPLE_BIDS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter bids based on search term and filters
  const filteredBids = bids.filter(bid => {
    const matchesSearch = 
      bid.bidder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.auction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || bid.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBids.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBids.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'winning':
        return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"><FaGavel size={10} /> Winning</span>;
      case 'outbid':
        return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"><FaExclamationTriangle size={10} /> Outbid</span>;
      case 'won':
        return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"><FaCheck size={10} /> Won</span>;
      case 'lost':
        return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"><FaTimes size={10} /> Lost</span>;
      default:
        return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded-md text-xs font-medium">{status}</span>;
    }
  };

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
          <h1 className="text-2xl md:text-3xl font-bold">Manage Bids</h1>
          
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all duration-300"
              onClick={() => toast.success("Bid data refreshed")}
            >
              <FaGavel size={14} />
              <span>Refresh Bids</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-4 border border-white/5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Bids</p>
                <h3 className="text-2xl font-bold mt-1">1,248</h3>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <FaGavel className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>8.5% increase</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-4 border border-white/5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Bids</p>
                <h3 className="text-2xl font-bold mt-1">426</h3>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <FaCheck className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>12.3% increase</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-4 border border-white/5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed Bids</p>
                <h3 className="text-2xl font-bold mt-1">822</h3>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <FaCheck className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>5.7% increase</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-4 border border-white/5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average Bid Amount</p>
                <h3 className="text-2xl font-bold mt-1">$487.25</h3>
              </div>
              <div className="bg-amber-500/20 p-3 rounded-lg">
                <FaGavel className="h-6 w-6 text-amber-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>3.2% increase</span>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative col-span-2"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-[#0d1d33]/60 backdrop-blur-sm border border-white/5 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 shadow-lg"
              placeholder="Search by bidder, auction or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="bg-[#0d1d33]/60 backdrop-blur-sm border border-white/5 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 shadow-lg appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="winning">Winning</option>
              <option value="outbid">Outbid</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </motion.div>
        </div>

        {/* Bids Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-white">
              <thead className="text-xs text-gray-300 uppercase bg-[#0d1d33]/80">
                <tr>
                  <th scope="col" className="px-6 py-3">ID</th>
                  <th scope="col" className="px-6 py-3">Date & Time</th>
                  <th scope="col" className="px-6 py-3">Bidder</th>
                  <th scope="col" className="px-6 py-3">Auction</th>
                  <th scope="col" className="px-6 py-3">Amount</th>
                  <th scope="col" className="px-6 py-3">Previous Bid</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Auction Ends</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((bid, index) => (
                    <motion.tr 
                      key={bid.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">{bid.id}</td>
                      <td className="px-6 py-4">{bid.date}</td>
                      <td className="px-6 py-4">{bid.bidder}</td>
                      <td className="px-6 py-4">{bid.auction}</td>
                      <td className="px-6 py-4 font-medium text-green-400">{bid.amount}</td>
                      <td className="px-6 py-4 text-gray-400">{bid.previousBid}</td>
                      <td className="px-6 py-4">{getStatusBadge(bid.status)}</td>
                      <td className="px-6 py-4">{bid.auctionEnds}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                          onClick={() => toast.success(`Viewing details for bid ${bid.id}`)}
                        >
                          <FaEye size={14} />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr className="border-b border-white/5">
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-400">
                      No bids found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredBids.length > 0 && (
            <div className="flex justify-between items-center p-4 border-t border-white/5">
              <div className="text-sm text-gray-400">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBids.length)} of {filteredBids.length} entries
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 hover:from-blue-500/30 hover:to-blue-600/30'}`}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 hover:from-blue-500/30 hover:to-blue-600/30'}`}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BidsPage;