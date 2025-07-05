/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Gavel,
  DollarSign,
  Percent,
  Clock,
} from "lucide-react";
import { User } from "../../../../lib/interfaces";

type TabType = "wins" | "bids" | "spending" | "winrate" | "active";

const medals = ["🥇", "🥈", "🥉"];

const LeaderboardsPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("wins");
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: "wins", label: "Most Wins", icon: <Trophy className="h-5 w-5" /> },
    { id: "bids", label: "Most Bids", icon: <Gavel className="h-5 w-5" /> },
    { id: "spending", label: "Highest Spender", icon: <DollarSign className="h-5 w-5" /> },
    { id: "winrate", label: "Best Win Rate", icon: <Percent className="h-5 w-5" /> },
    { id: "active", label: "Most Active", icon: <Clock className="h-5 w-5" /> },
  ];

  useEffect(() => {
    const fetchAllUsers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("https://asyncawait-auction-project.onrender.com/api/admin/users", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  const sortedUsers = [...users]
    .sort((a, b) => {
      switch (activeTab) {
        case "wins":
          return (b.auctions_won ?? 0) - (a.auctions_won ?? 0);
        case "bids":
          return (b.total_bids ?? 0) - (a.total_bids ?? 0);
        case "spending":
          return (b.spent_on_bids ?? 0) - (a.spent_on_bids ?? 0);
        case "winrate":
          return (b.win_rate ?? 0) - (a.win_rate ?? 0);
        case "active":
          return (b.total_auctions ?? 0) - (a.total_auctions ?? 0);
        default:
          return 0;
      }
    })
    .slice(0, 50);

  return (
    <div className="min-h-screen py-12 px-4 mt-10 sm:px-6">
      {/* Background Blur Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-orange-500/10 rounded-full filter blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-[250px] h-[250px] bg-purple-500/10 rounded-full filter blur-[60px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] bg-blue-500/10 rounded-full filter blur-[50px] animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-white flex justify-center items-center gap-3">
          🏆 Leaderboards
        </h1>
        <p className="text-gray-400 mt-2">
          Top 50 users based on wins, bids, spending, and more
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 flex justify-center"
      >
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/20"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Leaderboard List */}
      <div className="space-y-4 max-w-3xl mx-auto px-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : sortedUsers.length === 0 ? (
          <p className="text-center text-gray-400">No data available.</p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.ul
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="divide-y divide-white/10 bg-white/5 rounded-lg overflow-hidden"
            >
              {sortedUsers.map((user, index) => (
                <li
                  key={user.user_id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-orange-400 font-bold w-6">
                      {medals[index] || index + 1}
                    </span>
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm uppercase">
                      {(user.username || user.name || "?").charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.username ?? user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-orange-300 font-semibold">
                    {activeTab === "wins" && `${user.auctions_won} wins`}
                    {activeTab === "bids" && `${user.total_bids} bids`}
                    {activeTab === "spending" && `$${user.spent_on_bids}`}
                    {activeTab === "winrate" && `${user.win_rate}%`}
                    {activeTab === "active" && `${user.total_auctions} auctions`}
                  </span>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default LeaderboardsPage;
