"use client"

import React from 'react';

interface WinRatioChartProps {
  winRatio: number;
  bidsWon: number;
  bidsLost: number;
  totalBids: number;
}

const WinRatioChart: React.FC<WinRatioChartProps> = ({ winRatio, bidsWon, bidsLost, totalBids }) => {
  // Calculate the circumference of the circle
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the dash offset based on win ratio
  const dashOffset = circumference - (winRatio / 100) * circumference;
  
  return (
    <div className="relative flex flex-col items-center justify-center p-6">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Background circle */}
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <circle 
            cx="100" 
            cy="100" 
            r={radius} 
            fill="transparent" 
            stroke="#1e3a5f" 
            strokeWidth="20"
          />
          
          {/* Red segment (bids lost) */}
          <circle 
            cx="100" 
            cy="100" 
            r={radius} 
            fill="transparent" 
            stroke="#ff0000" 
            strokeWidth="20"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 100 100)"
            strokeLinecap="round"
          />
          
          {/* Blue segment (bids won) */}
          <circle 
            cx="100" 
            cy="100" 
            r={radius} 
            fill="transparent" 
            stroke="#00b7ff" 
            strokeWidth="20"
            strokeDasharray={circumference * (bidsWon / totalBids)}
            strokeDashoffset={circumference}
            transform="rotate(-90 100 100)"
            strokeLinecap="round"
          />
          
          {/* Green segment (additional visualization) */}
          <circle 
            cx="100" 
            cy="100" 
            r={radius} 
            fill="transparent" 
            stroke="#00ff7f" 
            strokeWidth="20"
            strokeDasharray={circumference * 0.25}
            strokeDashoffset={circumference * 0.75}
            transform="rotate(-90 100 100)"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold">Win Ratio</div>
          <div className="text-5xl font-bold text-white">{winRatio}%</div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
          <span>Bids won</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
          <span>Bids Lose</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
          <span>Total Bids</span>
        </div>
      </div>
    </div>
  );
};

export default WinRatioChart;