"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from '../../lib/interfaces';
import { useRouter } from 'next/navigation';
import { FaChartPie, FaExternalLinkAlt, FaFileInvoiceDollar } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Component imports
import WinRatioChart from './_components/WinRatioChart';
import StatCard from './_components/StatCard';
import ActionButton from './_components/ActionButton';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
    if (!token) {
      console.error("No token found");
      router.push("/login");
      return;
    }

    const fetchCurrentUserData = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://asyncawait-auction-project.onrender.com/api/getUser', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch user: ${res.status}`);
        }

        const userData = await res.json();

        if (userData?.message) {
          throw new Error(userData.message);
        }

        setUser(userData);
        setUserId(userData.user_id);
      } catch (e) {
        console.error("Error fetching user:", e);
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUserData();
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#021f49] to-[#010915]">
        <div className="bg-[#040c16]/50 p-8 rounded-lg shadow-lg text-white max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Error Loading Dashboard</h2>
          <p className="text-red-400">{error || 'Failed to load user data'}</p>
          <button 
            onClick={() => router.push('/login')} 
            className="mt-6 bg-[#7b62fb] hover:bg-[#6a52e5] text-white py-2 px-4 rounded-md transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const winRatio = user.total_bids > 0 ? Math.round((user.auctions_won / user.total_bids) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#021f49] to-[#010915] text-white p-6 rounded-xl">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">Welcome to <span className="text-[#ef863f]">Dashboard!</span></h1>
        <h2 className="text-4xl font-bold mt-2">{user.name}</h2>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 flex flex-wrap gap-3"
      >
        <ActionButton 
          href="/auctions/details"
          icon={<FaFileInvoiceDollar />}
          label="View Auctions Details"
        />
        <ActionButton 
          href="/bid/details"
          icon={<FaExternalLinkAlt />}
          label="View Bid Details"
        />
        <ActionButton 
          href="/payment/details"
          icon={<FaChartPie />}
          label="View Payment Details"
        />
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Win Ratio Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-5 flex justify-center items-center"
        >
          <WinRatioChart 
            winRatio={winRatio} 
            bidsWon={user.auctions_won} 
            bidsLost={user.total_bids - user.auctions_won} 
            totalBids={user.total_bids} 
          />
        </motion.div>

        {/* Right Column - Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-7"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard 
              title="Balance" 
              value={`$${user.money.toLocaleString()}`} 
              icon={<FaFileInvoiceDollar className="text-green-400" />} 
            />
            
            <StatCard 
              title="Auctions Created" 
              value="03" 
              icon={<FaExternalLinkAlt className="text-blue-400" />} 
            />
            
            <StatCard 
              title="Total Bids" 
              value={user.total_bids.toString()} 
              icon={<FaChartPie className="text-purple-400" />} 
            />
            
            <StatCard 
              title="Bids Won" 
              value={user.auctions_won.toString()} 
              icon={<FaChartPie className="text-yellow-400" />} 
            />
            
            <StatCard 
              title="Win Ratio" 
              value={`${winRatio.toFixed(2)}%`} 
              icon={<FaChartPie className="text-orange-400" />} 
              className="md:col-span-2"
            />
          </div>
        </motion.div>
      </div>

      {/* Create New Auction Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 flex justify-center"
      >
        <Link href="/auctions/create">
          <button className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-full flex items-center gap-2 transform transition-all duration-200 hover:scale-105 shadow-lg cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create New Auction
          </button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Dashboard;
