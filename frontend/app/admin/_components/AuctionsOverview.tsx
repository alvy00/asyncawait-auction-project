"use client";

import { motion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Link from "next/link";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface AuctionStats {
  totalAuctions: number;
  ongoingAuctions: number;
  completedAuctions: number;
  cancelledAuctions: number;
}

interface RecentAuction {
  id: string;
  date: string;
  time: string;
  name: string;
  product: string;
  startBid: string;
  status: "approved" | "pending" | "rejected" | "view details";
}

interface AuctionsOverviewProps {
  stats: AuctionStats;
  recentAuctions: RecentAuction[];
}

const AuctionsOverview = ({ stats, recentAuctions }: AuctionsOverviewProps) => {
  // Chart data
  const chartData = {
    labels: ["Ongoing Auctions", "Completed Auctions", "Cancelled Auctions"],
    datasets: [
      {
        data: [stats.ongoingAuctions, stats.completedAuctions, stats.cancelledAuctions],
        backgroundColor: ["#3b82f6", "#10b981", "#ef4444"],
        borderColor: ["rgba(59, 130, 246, 0.2)", "rgba(16, 185, 129, 0.2)", "rgba(239, 68, 68, 0.2)"],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-8 bg-[#0a1628]/40 backdrop-blur-sm rounded-xl p-4 border border-white/5 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Auctions overview</h2>
        <div className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-md">
          <span>Dec 2023</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="bg-[#0d1d33]/60 rounded-lg p-4 flex flex-col">
          <div className="relative h-48 mb-4">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{stats.totalAuctions.toLocaleString()}</span>
              <span className="text-sm text-gray-400">Total Auctions</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-auto">
            <div className="text-center">
              <div className="text-sm font-medium">{stats.ongoingAuctions.toLocaleString()}</div>
              <div className="text-xs text-blue-400">Ongoing</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">{stats.completedAuctions.toLocaleString()}</div>
              <div className="text-xs text-green-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">{stats.cancelledAuctions.toLocaleString()}</div>
              <div className="text-xs text-red-400">Cancelled</div>
            </div>
          </div>
        </div>

        {/* Recent Auctions Table */}
        <div className="lg:col-span-2 bg-[#0d1d33]/60 rounded-lg p-4 overflow-hidden">
          <div className="mb-3">
            <h3 className="text-sm font-medium mb-3">Recent Auctions</h3>
            
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-2 text-xs text-gray-400 border-b border-white/10 pb-2">
              <div className="col-span-1">ID</div>
              <div className="col-span-1">Date & Time</div>
              <div className="col-span-1">User Name</div>
              <div className="col-span-1">Product</div>
              <div className="col-span-1">Start Bid</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
          </div>

          <div className="max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
            {recentAuctions.map((auction) => (
              <div key={auction.id} className="grid grid-cols-7 gap-2 text-xs py-2 border-b border-white/5 items-center">
                <div className="col-span-1">
                  <div className="w-6 h-6 bg-purple-500/20 text-purple-400 rounded flex items-center justify-center font-medium">
                    #{auction.id.substring(1)}
                  </div>
                </div>
                <div className="col-span-1 text-gray-400">{auction.date} {auction.time}</div>
                <div className="col-span-1 text-white">{auction.name}</div>
                <div className="col-span-1 text-gray-300">{auction.product}</div>
                <div className="col-span-1 text-gray-300">${auction.startBid}</div>
                <div className="col-span-1">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium inline-block ${
                    auction.status === "approved" ? "bg-green-500/20 text-green-400" :
                    auction.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                    auction.status === "rejected" ? "bg-red-500/20 text-red-400" :
                    "bg-blue-500/20 text-blue-400"
                  }`}>
                    {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                  </span>
                </div>
                <div className="col-span-1 text-right">
                  <button className="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="19" cy="12" r="1"></circle>
                      <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Link href="/dashboard/admin/auctions" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
              More Details
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuctionsOverview;