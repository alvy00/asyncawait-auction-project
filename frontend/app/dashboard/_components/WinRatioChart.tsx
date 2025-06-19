/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";

interface WinRatioChartProps {
  winRatio: number;
  bidsWon: number;
  bidsLost: number;
}

const WinRatioChart: React.FC<WinRatioChartProps> = ({
  winRatio,
  bidsWon,
  bidsLost,
}) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  const wonOffset = circumference * ((100 - winRatio) / 100);
  const lostRatio = 100 - winRatio;

  return (
    <div className="relative flex flex-col items-center justify-center p-6">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="#1e3a5f"
            strokeWidth="20"
          />

          {/* Loss segment (goes first so won overlays it) */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="#ff4d4f"
            strokeWidth="20"
            strokeDasharray={circumference}
            strokeDashoffset={0}
            transform="rotate(-90 100 100)"
            strokeLinecap="round"
          />

          {/* Win segment */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="#00c853"
            strokeWidth="20"
            strokeDasharray={circumference}
            strokeDashoffset={wonOffset}
            transform="rotate(-90 100 100)"
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-semibold text-white">Win Ratio</div>
          <div className="text-5xl font-bold text-white">{winRatio}%</div>
        </div>
      </div>

    </div>
  );
};

export default WinRatioChart;
