"use client"

import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#021f49] to-[#010915]">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-white text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;