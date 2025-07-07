"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import AdminHeader from "./_components/AdminHeader";
import StatsOverview from "./_components/StatsOverview";
import UsersChart from "./_components/UsersChart";
import AuctionsOverview from "./_components/AuctionsOverview";
import BidsOverview from "./_components/BidsOverview";
import RecentActivities from "./_components/RecentActivities";
import { useUser } from "../../lib/user-context";

// Sample data (replace with API calls in production)
const SAMPLE_USER_STATS = {
  totalUsers: 10500,
  totalGrowth: 10.4,
  activeUsers: 3600,
  activeGrowth: 2.4,
  bannedUsers: 506,
  bannedGrowth: 0.6,
  guestUsers: 856,
  guestGrowth: 4.4,
};

// Sample chart data
const SAMPLE_CHART_DATA = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  totalUsers: [5000, 15000, 25000, 30000, 35000, 40000, 42000, 45000, 60000, 80000, 95000, 110000],
  activeUsers: [2000, 5000, 8000, 10000, 12000, 15000, 18000, 25000, 22000, 20000, 18000, 15000],
};

// Sample auction data
const SAMPLE_AUCTION_STATS = {
  totalAuctions: 23648,
  ongoingAuctions: 15624,
  completedAuctions: 5546,
  cancelledAuctions: 2478,
};

const SAMPLE_RECENT_AUCTIONS = [
  { id: "#1532", date: "Dec 20", time: "10:06 AM", name: "Ajay Ahmad", product: "iPhone 14 pro", startBid: "329.40", status: "approved" },
  { id: "#1531", date: "Dec 20", time: "9:59 AM", name: "Manvir", product: "iPhone 13 pro", startBid: "177.24", status: "pending" },
  { id: "#1530", date: "Dec 20", time: "12:54 AM", name: "Shahriar Islam", product: "iPhone 14 pro", startBid: "13.10", status: "rejected" },
  { id: "#1529", date: "Dec 18", time: "2:23 PM", name: "Sohaan Khan", product: "iPhone 14 pro", startBid: "369.55", status: "view details" },
  { id: "#1528", date: "Dec 17", time: "2:20 PM", name: "Amitav Hasan", product: "iPhone 14 pro", startBid: "246.78", status: "pending" },
  { id: "#1527", date: "Dec 15", time: "9:46 AM", name: "Mustafa Khan", product: "iPhone 12 pro", startBid: "64.20", status: "rejected" },
];

// Sample bids data
const SAMPLE_BIDS_STATS = {
  totalBids: 40550,
  wonBids: 5700,
  lostBids: 32380,
  cancelledBids: 2470,
};

const SAMPLE_RECENT_BIDS = [
  { id: "#1532", date: "Dec 20", time: "10:06 AM", name: "Ajay Ahmad", product: "iPhone 14 pro", bidAmount: "329.40", status: "won" },
  { id: "#1531", date: "Dec 20", time: "9:59 AM", name: "Manvir", product: "iPhone 13 pro", bidAmount: "177.24", status: "pending" },
  { id: "#1530", date: "Dec 20", time: "12:54 AM", name: "Shahriar Islam", product: "iPhone 14 pro", bidAmount: "13.10", status: "lost" },
  { id: "#1529", date: "Dec 18", time: "2:23 PM", name: "Sohaan Khan", product: "iPhone 14 pro", bidAmount: "369.55", status: "view details" },
  { id: "#1528", date: "Dec 17", time: "2:20 PM", name: "Amitav Hasan", product: "iPhone 14 pro", bidAmount: "246.78", status: "pending" },
  { id: "#1527", date: "Dec 15", time: "9:46 AM", name: "Mustafa Khan", product: "iPhone 12 pro", bidAmount: "64.20", status: "lost" },
];

// Sample activities data
const SAMPLE_ACTIVITIES = [
  { id: "1", time: "10:05 AM", userName: "Ajay Ahmad", action: "Placed a bid on iPhone 14 Pro", extraInfo: "Bid: $350", actionType: "bid" },
  { id: "2", time: "10:12 AM", userName: "Manvir", action: "Approved voucher Samsung TV", extraInfo: "Auction ID: #1521", actionType: "auction" },
  { id: "3", time: "10:17 AM", userName: "Shahriar Islam", action: "Registered as a new user", extraInfo: "Role: buyer/seller", actionType: "profile" },
  { id: "4", time: "10:20 AM", userName: "Sohaan Khan", action: "Created a new auction listing", extraInfo: "Starting bid: $400", actionType: "starting" },
  { id: "5", time: "10:25 AM", userName: "Amitav Hasan", action: "Rejected a product listing", extraInfo: "Product ID: #3559", actionType: "product" },
  { id: "6", time: "10:46 AM", userName: "Mustafa Khan", action: "Invited a bid on iPhone 12 Pro", extraInfo: "Auction: iPhone 12", actionType: "bid" },
];

const AdminDashboard = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(SAMPLE_USER_STATS);
  const [chartData, setChartData] = useState(SAMPLE_CHART_DATA);
  const [dateRange, setDateRange] = useState("Jan 2025 - Dec 2025");
  const [auctionStats, setAuctionStats] = useState(SAMPLE_AUCTION_STATS);
  const [recentAuctions, setRecentAuctions] = useState(SAMPLE_RECENT_AUCTIONS);
  const [bidStats, setBidStats] = useState(SAMPLE_BIDS_STATS);
  const [recentBids, setRecentBids] = useState(SAMPLE_RECENT_BIDS);
  const [activities, setActivities] = useState(SAMPLE_ACTIVITIES);
  const router = useRouter();

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // In a real app, you would fetch data from an API
  const fetchData = async () => {
    try {
      // API calls would go here
      // setStats(apiResponse.stats);
      // setChartData(apiResponse.chartData);
      // setAuctionStats(apiResponse.auctionStats);
      // setRecentAuctions(apiResponse.recentAuctions);
      // setBidStats(apiResponse.bidStats);
      // setRecentBids(apiResponse.recentBids);
      // setActivities(apiResponse.activities);
    } catch (error) {
      toast.error("Failed to load admin data");
      console.error(error);
    }
  };

  if (loading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen text-white p-4 md:p-6 rounded-xl">
      {/* Admin Header */}
      <AdminHeader username={user.name} />
      
      {/* Users Overview Section */}
      <StatsOverview stats={stats} />
      
      {/* Users Chart Section */}
      <UsersChart data={chartData} dateRange={dateRange} />
      
      {/* Auctions Overview Section */}
      <AuctionsOverview stats={auctionStats} recentAuctions={recentAuctions} />
      
      {/* Bids Overview Section */}
      <BidsOverview stats={bidStats} recentBids={recentBids} />
      
      {/* Recent Activities Section */}
      <RecentActivities activities={activities} />
      
      {/* More Details Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 flex justify-end"
      >
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transform transition-all duration-200 hover:scale-105 shadow-lg">
          More Details
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </button>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;