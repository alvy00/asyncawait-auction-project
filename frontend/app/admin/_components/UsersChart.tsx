"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface UsersChartProps {
  data: {
    labels: string[];
    totalUsers: number[];
    activeUsers: number[];
  };
  dateRange: string;
}

const UsersChart = ({ data, dateRange }: UsersChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Chart configuration
  const chartOptions = {
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
              return `${value / 1000}k`;
            }
            return value;
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
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Total users",
        data: data.totalUsers,
        borderColor: "#FF6B6B",
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(255, 107, 107, 0.5)");
          gradient.addColorStop(1, "rgba(255, 107, 107, 0)");
          return gradient;
        },
        pointBackgroundColor: "#FF6B6B",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.3,
        borderWidth: 3,
      },
      {
        label: "Active Users",
        data: data.activeUsers,
        borderColor: "#4ECDC4",
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(78, 205, 196, 0.5)");
          gradient.addColorStop(1, "rgba(78, 205, 196, 0)");
          return gradient;
        },
        pointBackgroundColor: "#4ECDC4",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.3,
        borderWidth: 3,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 mb-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF6B6B]"></div>
              <span className="text-sm text-gray-300">Total users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4ECDC4]"></div>
              <span className="text-sm text-gray-300">Active Users</span>
            </div>
          </div>
          <div className="text-xs text-gray-400">{dateRange}</div>
        </div>
        
        <div className="mt-3 sm:mt-0">
          <select className="bg-white/10 text-white text-sm rounded-lg px-3 py-1.5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="year">Jan 2025 - Dec 2025</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
        </div>
      </div>
      
      <div className="w-full h-[300px] md:h-[400px]" ref={chartRef}>
        <Line options={chartOptions} data={chartData} />
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-2xl font-bold">10.5k</span>
            <span className="text-xs text-gray-400">Dec 25, 2025</span>
          </div>
          <div className="text-sm text-green-400 flex items-center">
            <span>10.4%</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 15-6-6-6 6"/>
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UsersChart;