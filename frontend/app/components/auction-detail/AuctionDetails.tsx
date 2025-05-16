"use client";

import Image from "next/image";
import { Heart, HelpCircle } from "lucide-react";

interface AuctionDetailsProps {
  seller: {
    name: string;
    image: string;
  };
  title: string;
  description: string;
  currentBid: number;
  startingBid: number;
  condition: string;
  categories: string[];
  endTime: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    fullDate: string;
    timeZone: string;
  };
}

const AuctionDetails = ({
  seller,
  title,
  description,
  currentBid,
  startingBid,
  condition,
  categories,
  endTime,
}: AuctionDetailsProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <Image
            src={seller.image}
            alt={seller.name}
            width={32}
            height={32}
          />
        </div>
        <span className="text-lg">{seller.name}</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>

      <p className="text-gray-300 mb-4">{description}</p>

      <div className="mb-4">
        <div className="text-sm text-gray-400">Current bid:</div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">${currentBid.toFixed(2)}</span>
          <span className="text-[#f62c2c]">(Starting bid: ${startingBid.toFixed(2)})</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-400">Item Condition:</div>
          <div className="font-medium">{condition}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Categories:</div>
          <div className="font-medium">{categories.join(", ")}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Time left:</div>
        <div className="flex gap-2">
          <div className="bg-[#010915] border border-gray-700 rounded p-2 text-center min-w-[70px]">
            <div className="text-xl font-bold">{endTime.days}</div>
            <div className="text-xs text-gray-400">Days</div>
          </div>
          <div className="bg-[#010915] border border-gray-700 rounded p-2 text-center min-w-[70px]">
            <div className="text-xl font-bold">{endTime.hours}</div>
            <div className="text-xs text-gray-400">Hours</div>
          </div>
          <div className="bg-[#010915] border border-gray-700 rounded p-2 text-center min-w-[70px]">
            <div className="text-xl font-bold">{endTime.minutes}</div>
            <div className="text-xs text-gray-400">Minutes</div>
          </div>
          <div className="bg-[#010915] border border-gray-700 rounded p-2 text-center min-w-[70px]">
            <div className="text-xl font-bold">{endTime.seconds}</div>
            <div className="text-xs text-gray-400">Seconds</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm">Auction ends: {endTime.fullDate}</div>
        <div className="text-sm">Time Zone: {endTime.timeZone}</div>
      </div>

      <div className="flex gap-4 mt-4">
        <button className="flex items-center gap-1 text-sm">
          <HelpCircle className="h-4 w-4" />
          Ask Question
        </button>
        <button className="flex items-center gap-1 text-sm">
          <Heart className="h-4 w-4" />
          Add to Watch list
        </button>
      </div>
    </div>
  );
};

export default AuctionDetails;