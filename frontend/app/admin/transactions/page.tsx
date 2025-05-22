"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaSearch, FaFilter, FaEye, FaDownload, FaCheck, FaTimes, FaExclamationTriangle, FaMoneyBill } from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";

// Sample transactions data
const SAMPLE_TRANSACTIONS = [
  { id: "#T1001", date: "Dec 20, 2023 14:30", user: "Ajay Ahmad", auction: "iPhone 14 Pro", amount: "$450.00", type: "purchase", status: "completed", paymentMethod: "Credit Card" },
  { id: "#T1002", date: "Dec 20, 2023 13:45", user: "Manvir Singh", auction: "Vintage Camera", amount: "$200.50", type: "purchase", status: "completed", paymentMethod: "PayPal" },
  { id: "#T1003", date: "Dec 19, 2023 16:20", user: "Shahriar Islam", auction: "Designer Watch", amount: "$750.00", type: "purchase", status: "pending", paymentMethod: "Bank Transfer" },
  { id: "#T1004", date: "Dec 19, 2023 11:15", user: "Sohaan Khan", auction: "Antique Vase", amount: "$420.75", type: "purchase", status: "completed", paymentMethod: "Credit Card" },
  { id: "#T1005", date: "Dec 18, 2023 09:30", user: "Amitav Hasan", auction: "Gaming Laptop", amount: "$1500.00", type: "purchase", status: "failed", paymentMethod: "Debit Card" },
  { id: "#T1006", date: "Dec 17, 2023 17:45", user: "Mustafa Khan", auction: "Leather Jacket", amount: "$185.00", type: "refund", status: "completed", paymentMethod: "Credit Card" },
  { id: "#T1007", date: "Dec 16, 2023 14:10", user: "Rahul Dev", auction: "Mountain Bike", amount: "$1050.00", type: "purchase", status: "completed", paymentMethod: "PayPal" },
  { id: "#T1008", date: "Dec 15, 2023 10:30", user: "Priya Sharma", auction: "Diamond Necklace", amount: "$3200.00", type: "purchase", status: "completed", paymentMethod: "Bank Transfer" },
  { id: "#T1009", date: "Dec 14, 2023 13:20", user: "Michael Chen", auction: "Drone Camera", amount: "$950.25", type: "refund", status: "pending", paymentMethod: "PayPal" },
  { id: "#T1010", date: "Dec 13, 2023 15:45", user: "Sarah Wilson", auction: "Handmade Pottery", amount: "$175.50", type: "purchase", status: "failed", paymentMethod: "Debit Card" },
];

const TransactionsPage = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState(SAMPLE_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
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

  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.auction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"><FaCheck size={10} /> Completed</span>;
      case 'pending':
        return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"><FaExclamationTriangle size={10} /> Pending</span>;
      case 'failed':
        return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"><FaTimes size={10} /> Failed</span>;
      default:
        return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded-md text-xs font-medium">{status}</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch(type) {
      case 'purchase':
        return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md text-xs font-medium">Purchase</span>;
      case 'refund':
        return <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-md text-xs font-medium">Refund</span>;
      default:
        return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded-md text-xs font-medium">{type}</span>;
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
          <h1 className="text-2xl md:text-3xl font-bold">Manage Transactions</h1>
          
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all duration-300"
              onClick={() => toast.success("Transaction data refreshed")}
            >
              <FaMoneyBill size={14} />
              <span>Refresh Data</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-green-500/20 transition-all duration-300"
              onClick={() => toast.success("Report downloaded")}
            >
              <FaDownload size={14} />
              <span>Export Report</span>
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
                <p className="text-gray-400 text-sm">Total Transactions</p>
                <h3 className="text-2xl font-bold mt-1">2,548</h3>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <FaMoneyBill className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>7.2% increase</span>
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
                <p className="text-gray-400 text-sm">Completed</p>
                <h3 className="text-2xl font-bold mt-1">1,985</h3>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <FaCheck className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>9.3% increase</span>
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
                <p className="text-gray-400 text-sm">Pending</p>
                <h3 className="text-2xl font-bold mt-1">342</h3>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <FaExclamationTriangle className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-red-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span>2.1% decrease</span>
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
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">$1,245,632</h3>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <FaMoneyBill className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>12.8% increase</span>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0d1d33]/60 backdrop-blur-sm border border-white/5 rounded-lg px-4 py-2.5 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <div className="flex items-center bg-[#0d1d33]/60 backdrop-blur-sm border border-white/5 rounded-lg px-4 py-2 text-white">
              <FaFilter className="mr-2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-white w-full focus:outline-none"
              >
                <option value="all" className="bg-[#0d1d33]">All Statuses</option>
                <option value="completed" className="bg-[#0d1d33]">Completed</option>
                <option value="pending" className="bg-[#0d1d33]">Pending</option>
                <option value="failed" className="bg-[#0d1d33]">Failed</option>
              </select>
            </div>
          </div>
          
          {/* Type Filter */}
          <div className="relative">
            <div className="flex items-center bg-[#0d1d33]/60 backdrop-blur-sm border border-white/5 rounded-lg px-4 py-2 text-white">
              <FaFilter className="mr-2 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-transparent text-white w-full focus:outline-none"
              >
                <option value="all" className="bg-[#0d1d33]">All Types</option>
                <option value="purchase" className="bg-[#0d1d33]">Purchase</option>
                <option value="refund" className="bg-[#0d1d33]">Refund</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#0d1d33]/60 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden shadow-xl mb-6"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">ID</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">User</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Auction</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Amount</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Type</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Payment Method</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="py-4 px-4">{transaction.id}</td>
                      <td className="py-4 px-4">{transaction.date}</td>
                      <td className="py-4 px-4">{transaction.user}</td>
                      <td className="py-4 px-4">{transaction.auction}</td>
                      <td className="py-4 px-4 font-medium">{transaction.amount}</td>
                      <td className="py-4 px-4">{getTypeBadge(transaction.type)}</td>
                      <td className="py-4 px-4">{getStatusBadge(transaction.status)}</td>
                      <td className="py-4 px-4">{transaction.paymentMethod}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-blue-500/20 hover:bg-blue-500/30 p-2 rounded-lg transition-colors duration-200"
                            onClick={() => toast.success(`Viewing details for ${transaction.id}`)}
                          >
                            <FaEye className="text-blue-400" size={14} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-green-500/20 hover:bg-green-500/30 p-2 rounded-lg transition-colors duration-200"
                            onClick={() => toast.success(`Receipt for ${transaction.id} downloaded`)}
                          >
                            <FaDownload className="text-green-400" size={14} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-400">
                      No transactions found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </p>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${currentPage === 1 ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 hover:from-blue-500/30 hover:to-blue-600/30'}`}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${currentPage === totalPages ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 hover:from-blue-500/30 hover:to-blue-600/30'}`}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TransactionsPage;