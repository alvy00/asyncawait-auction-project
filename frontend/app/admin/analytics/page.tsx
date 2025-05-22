"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { FaDownload, FaCalendarAlt, FaChartLine, FaChartBar, FaChartPie, FaFilter, FaSearch } from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Sample data for reports
const SAMPLE_REVENUE_DATA = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Revenue",
      data: [12500, 15000, 18000, 16000, 22000, 25000, 31000, 38000, 42000, 45000, 48000, 52000],
      borderColor: "#4ECDC4",
      backgroundColor: "rgba(78, 205, 196, 0.1)",
      tension: 0.3,
      fill: true,
    },
    {
      label: "Expenses",
      data: [8000, 9000, 10000, 9500, 12000, 14000, 16000, 18000, 19000, 20000, 21000, 22000],
      borderColor: "#FF6B6B",
      backgroundColor: "rgba(255, 107, 107, 0.1)",
      tension: 0.3,
      fill: true,
    },
  ],
};

const SAMPLE_USER_GROWTH_DATA = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "New Users",
      data: [500, 620, 710, 690, 840, 980, 1100, 1250, 1380, 1500, 1650, 1800],
      backgroundColor: "rgba(78, 205, 196, 0.8)",
    },
  ],
};

const SAMPLE_AUCTION_CATEGORIES_DATA = {
  labels: ["Electronics", "Fashion", "Home & Garden", "Collectibles", "Vehicles", "Art", "Jewelry", "Other"],
  datasets: [
    {
      data: [35, 20, 15, 10, 8, 5, 5, 2],
      backgroundColor: [
        "#4ECDC4",
        "#FF6B6B",
        "#FFD166",
        "#06D6A0",
        "#118AB2",
        "#073B4C",
        "#8338EC",
        "#3A86FF",
      ],
      borderWidth: 0,
    },
  ],
};

const SAMPLE_STATS = {
  totalRevenue: "$364,500",
  revenueGrowth: 12.5,
  totalAuctions: "23,648",
  auctionGrowth: 8.3,
  totalUsers: "10,500",
  userGrowth: 15.2,
  conversionRate: "3.8%",
  conversionGrowth: 0.5,
};

const SAMPLE_TOP_SELLERS = [
  { id: "#1", name: "Ajay Ahmad", sales: 156, revenue: "$12,450", category: "Electronics" },
  { id: "#2", name: "Manvir Singh", sales: 142, revenue: "$10,820", category: "Collectibles" },
  { id: "#3", name: "Shahriar Islam", sales: 134, revenue: "$9,760", category: "Fashion" },
  { id: "#4", name: "Sohaan Khan", sales: 128, revenue: "$8,950", category: "Jewelry" },
  { id: "#5", name: "Amitav Hasan", sales: 115, revenue: "$7,840", category: "Art" },
];

const ReportsAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("Last 12 Months");
  const [stats, setStats] = useState(SAMPLE_STATS);
  const [revenueData, setRevenueData] = useState(SAMPLE_REVENUE_DATA);
  const [userGrowthData, setUserGrowthData] = useState(SAMPLE_USER_GROWTH_DATA);
  const [categoryData, setCategoryData] = useState(SAMPLE_AUCTION_CATEGORIES_DATA);
  const [topSellers, setTopSellers] = useState(SAMPLE_TOP_SELLERS);
  
  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          callback: (value: number) => {
            if (value >= 1000) {
              return `$${value / 1000}k`;
            }
            return `$${value}`;
          },
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 10,
        cornerRadius: 6,
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
  };

  const barChartOptions = {
    ...lineChartOptions,
    scales: {
      ...lineChartOptions.scales,
      y: {
        ...lineChartOptions.scales.y,
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          callback: (value: number) => {
            return value;
          },
        },
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 10,
        cornerRadius: 6,
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((acc: number, data: number) => acc + data, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}%`;
          }
        }
      },
    },
  };

  const handleExportReport = () => {
    // In a real app, this would generate and download a report
    alert("Report export functionality would be implemented here");
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
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-gray-400 mt-1">Comprehensive insights into your auction platform</p>
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <FaCalendarAlt className="ml-3 text-gray-400" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-transparent border-none text-white py-2 pl-2 pr-8 w-full focus:outline-none focus:ring-0 appearance-none cursor-pointer"
                >
                  <option value="Last 7 Days" className="bg-[#0d1d33]">Last 7 Days</option>
                  <option value="Last 30 Days" className="bg-[#0d1d33]">Last 30 Days</option>
                  <option value="Last 12 Months" className="bg-[#0d1d33]">Last 12 Months</option>
                  <option value="Year to Date" className="bg-[#0d1d33]">Year to Date</option>
                  <option value="Custom Range" className="bg-[#0d1d33]">Custom Range</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportReport}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all duration-300"
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
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalRevenue}</h3>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <FaChartLine className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>{stats.revenueGrowth}% increase</span>
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
                <p className="text-gray-400 text-sm">Total Auctions</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalAuctions}</h3>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <FaChartBar className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>{stats.auctionGrowth}% increase</span>
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
                <p className="text-gray-400 text-sm">Total Users</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalUsers}</h3>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <FaChartLine className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>{stats.userGrowth}% increase</span>
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
                <p className="text-gray-400 text-sm">Conversion Rate</p>
                <h3 className="text-2xl font-bold mt-1">{stats.conversionRate}</h3>
              </div>
              <div className="bg-amber-500/20 p-3 rounded-lg">
                <FaChartPie className="h-6 w-6 text-amber-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>{stats.conversionGrowth}% increase</span>
            </div>
          </motion.div>
        </div>

        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-4 border border-white/5 shadow-xl mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Revenue Overview</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Filter:</span>
              <select 
                className="bg-white/5 border border-white/10 rounded-lg text-sm py-1 px-2 text-white focus:outline-none focus:ring-0"
              >
                <option value="monthly" className="bg-[#0d1d33]">Monthly</option>
                <option value="quarterly" className="bg-[#0d1d33]">Quarterly</option>
                <option value="yearly" className="bg-[#0d1d33]">Yearly</option>
              </select>
            </div>
          </div>
          <div className="h-80">
            <Line data={revenueData} options={lineChartOptions} />
          </div>
        </motion.div>

        {/* User Growth and Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-4 border border-white/5 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">User Growth</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">View:</span>
                <select 
                  className="bg-white/5 border border-white/10 rounded-lg text-sm py-1 px-2 text-white focus:outline-none focus:ring-0"
                >
                  <option value="new" className="bg-[#0d1d33]">New Users</option>
                  <option value="active" className="bg-[#0d1d33]">Active Users</option>
                  <option value="all" className="bg-[#0d1d33]">All Users</option>
                </select>
              </div>
            </div>
            <div className="h-64">
              <Bar data={userGrowthData} options={barChartOptions} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-4 border border-white/5 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Auction Categories</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Sort By:</span>
                <select 
                  className="bg-white/5 border border-white/10 rounded-lg text-sm py-1 px-2 text-white focus:outline-none focus:ring-0"
                >
                  <option value="popularity" className="bg-[#0d1d33]">Popularity</option>
                  <option value="revenue" className="bg-[#0d1d33]">Revenue</option>
                  <option value="growth" className="bg-[#0d1d33]">Growth</option>
                </select>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="w-3/4 h-full">
                <Doughnut data={categoryData} options={doughnutChartOptions} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Top Sellers Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="bg-[#0d1d33]/60 backdrop-blur-sm rounded-xl p-4 border border-white/5 shadow-xl mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Top Sellers</h2>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search sellers..." 
                className="bg-white/5 border border-white/10 rounded-lg text-sm py-2 pl-9 pr-4 text-white w-48 focus:outline-none focus:ring-0 focus:border-blue-500 transition-all duration-300"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Rank</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Seller</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Sales</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Revenue</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
                </tr>
              </thead>
              <tbody>
                {topSellers.map((seller, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150">
                    <td className="py-3 px-4">{seller.id}</td>
                    <td className="py-3 px-4">{seller.name}</td>
                    <td className="py-3 px-4">{seller.sales}</td>
                    <td className="py-3 px-4">{seller.revenue}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs" 
                        style={{
                          backgroundColor: 
                            seller.category === "Electronics" ? "rgba(78, 205, 196, 0.2)" :
                            seller.category === "Collectibles" ? "rgba(255, 209, 102, 0.2)" :
                            seller.category === "Fashion" ? "rgba(255, 107, 107, 0.2)" :
                            seller.category === "Jewelry" ? "rgba(6, 214, 160, 0.2)" :
                            seller.category === "Art" ? "rgba(17, 138, 178, 0.2)" : "rgba(58, 134, 255, 0.2)",
                          color: 
                            seller.category === "Electronics" ? "rgb(78, 205, 196)" :
                            seller.category === "Collectibles" ? "rgb(255, 209, 102)" :
                            seller.category === "Fashion" ? "rgb(255, 107, 107)" :
                            seller.category === "Jewelry" ? "rgb(6, 214, 160)" :
                            seller.category === "Art" ? "rgb(17, 138, 178)" : "rgb(58, 134, 255)",
                        }}
                      >
                        {seller.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ReportsAnalyticsPage;