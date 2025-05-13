/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Countdown } from "./Countdown";
import { Auction } from "../../lib/interfaces";
import { UpcomingAuctionCardProps } from "../../lib/interfaces";

const FALLBACK_IMAGE = "/fallback.jpg";


const UpcomingAuctionCard = ({ auction, auctionCreator }: UpcomingAuctionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const imageSrc = auction.images?.[0]?.trim() || FALLBACK_IMAGE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-2xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 mb-4"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageSrc}
          alt={auction.item_name}
          fill
          className={cn(
            "object-cover transition-transform duration-700",
            isHovered ? "scale-110" : "scale-100"
          )}
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-light px-3 py-1 z-10 rounded-lg">
          Upcoming
        </div>
      </div>

      {/* Content */}
      <div className="p-6 text-white">
        <h3 className="text-2xl font-bold mb-1">{auction.item_name}</h3>
        <p className="text-sm text-gray-300 mb-2">
          Starting Price:{" "}
          <span className="font-semibold text-orange-400">
            ${auction.starting_price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </p>

        {/* Countdown */}
        <div className="text-sm text-white mb-2">
          ⏳ Starts in:{" "}
          <Countdown endTime={auction.start_time} />
        </div>

        {/* Seller Info */}
        <div className="flex items-center text-gray-300 text-sm mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {auctionCreator}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="bg-orange-500 text-white px-4 py-2 text-sm rounded-md hover:bg-orange-600 transition">
            Notify Me
          </button>
          <button className="border border-white/30 text-sm px-4 py-2 rounded-md hover:bg-white/10 transition">
            Preview
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UpcomingAuctionCard;
