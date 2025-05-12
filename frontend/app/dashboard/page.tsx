"use client"

import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import { User } from '../../lib/interfaces';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import BidHistoryCard from '../components/BidHistoryCard';

const Dashboard = () => {
  const [user, setUser] = useState<User>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [bidsHistory, setBidHistory] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const bidsPerPage = 20;

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
        const res = await fetch('https://asyncawait-auction-project.onrender.com/api/getUser', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok || !res.body) {
          console.error("Failed to fetch user or empty response");
          return;
        }

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          console.error("Expected JSON, got:", contentType);
          return;
        }

        const userData = await res.json();

        if (userData?.message) {
          console.error("API returned error:", userData.message);
          return;
        }

        setUser(userData);
        setUserId(userData.user_id);
      } catch (e) {
        console.error("Error fetching user:", e);
      }
    };

    fetchCurrentUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchCurrentUserBidHistory = async () => {
        try {
          const token = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
          const res = await fetch('http://localhost:8000/api/auctions/bidhistory', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: userId }),
          });

          const r = await res.json();
          setBidHistory(r);
        } catch (e) {
          console.error('Error fetching bid history:', e);
        }
      };

      fetchCurrentUserBidHistory();
    }
  }, [userId]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading user...</p>
      </div>
    );
  }

  const winRatio = user.total_bids > 0 ? ((user.bids_won / user.total_bids) * 100).toFixed(2) : "0.00";

  // Pagination logic
  const indexOfLastBid = currentPage * bidsPerPage;
  const indexOfFirstBid = indexOfLastBid - bidsPerPage;
  const currentBids = bidsHistory.slice(indexOfFirstBid, indexOfLastBid);
  const totalPages = Math.ceil(bidsHistory.length / bidsPerPage);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">

          {/* Header Section */}
          <div className="flex items-center justify-center p-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="text-center text-white">
              <h2 className="text-3xl font-extrabold">{user.name}</h2>
              <p className="mt-2 text-sm">{user.email}</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">User Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Balance</h4>
                <p className="text-lg font-bold text-gray-700 dark:text-gray-300">${user.money}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Total Bids</h4>
                <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{user.total_bids}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Bids Won</h4>
                <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{user.bids_won}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Win Ratio</h4>
                <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{winRatio}%</p>
              </div>
            </div>
          </div>

          {/* Action Button: New Auction */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 text-right">
            <Link href="/auctions/create">
              <button className="flex items-center bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-6 py-3 rounded-full transform transition-all duration-200 ease-in-out hover:scale-105">
                <FaEdit className="h-5 w-5 mr-2" />
                Create New Auction
              </button>
            </Link>
          </div>
        </div>

        {/* User Bid History */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 space-y-4 mt-5 transition-colors duration-300 max-w-4xl mx-auto overflow-hidden">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Your Bid History
          </h2>

          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {currentBids.length > 0 ? (
              currentBids.map((bid, index) => (
                <BidHistoryCard key={index} item_name={bid.auction_id} bid={bid.bid_amount} />
              ))
            ) : (
              <p className="text-gray-700 dark:text-gray-300">No bids placed yet.</p>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 pt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
