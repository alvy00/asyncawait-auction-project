/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import BackButton from '../components/BackButton';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);


  // Example user data
  // const user = {
  //   name: 'John Doe',
  //   email: 'john.doe@example.com',
  //   money: 1200.50,
  //   totalBids: 25,
  //   bidsWon: 18,
  //   winRatio: 72,
  // };

  useEffect(() => {
    const fetchCurrentUserData = async () => {
      const token = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
  
      if (!token) {
        console.error("No token found");
        return;
      }
  
      try {
        const res = await fetch('https://asyncawait-auction-project.onrender.com/api/getUser', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Handle failed responses
        if (!res.ok) {
          const errorMessage = await res.text();
          console.error("Failed to fetch user:", res.statusText, errorMessage);
          return;
        }
  
        // Ensure the response is JSON
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          console.error("Expected JSON, got:", contentType);
          return;
        }
  
        const userData = await res.json();
  
        // Handle errors from userData (e.g., message field indicating user not found)
        if (userData?.message) {
          console.error("API returned error:", userData.message);
          return;
        }
  
        // Proceed if userData is valid
        console.log(userData);
        setUser(userData);
      } catch (e) {
        console.error("Error fetching user:", e);
      }
    };
  
    fetchCurrentUserData();
  }, []);
  

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading user...</p>
      </div>
    );
  }

  const winRatio = user.total_bids > 0
                    ? ((user.bids_won / user.total_bids) * 100).toFixed(2)
                    : "0.00";


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-6">
      <BackButton />

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
    </div>
  );
};

export default Dashboard;
