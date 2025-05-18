"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface StatsOverviewProps {
  stats: {
    totalUsers: number;
    totalGrowth: number;
    activeUsers: number;
    activeGrowth: number;
    bannedUsers: number;
    bannedGrowth: number;
    guestUsers: number;
    guestGrowth: number;
  };
}

const StatsOverview = ({ stats }: StatsOverviewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-8"
    >
      <h2 className="text-xl font-bold mb-4">Users overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers.toLocaleString()} 
          growth={stats.totalGrowth} 
        />
        
        <StatCard 
          title="Active Users" 
          value={stats.activeUsers.toLocaleString()} 
          growth={stats.activeGrowth} 
        />
        
        <StatCard 
          title="Banned Users" 
          value={stats.bannedUsers.toLocaleString()} 
          growth={stats.bannedGrowth} 
        />
        
        <StatCard 
          title="Guest Users" 
          value={stats.guestUsers.toLocaleString()} 
          growth={stats.guestGrowth} 
        />
      </div>
    </motion.div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  growth: number;
}

const StatCard = ({ title, value, growth }: StatCardProps) => {
  return (
    <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm text-gray-400">{title}</h3>
        <button className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </button>
      </div>
      
      <div className="flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl font-bold">{value}</h2>
        <div className={`flex items-center text-sm ${growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          <span className="mr-1">{growth >= 0 ? '+' : ''}{growth}%</span>
          {growth >= 0 ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 15-6-6-6 6"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;