"use client";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";

const FALLBACK_IMAGE = '/fallback.jpg'

export interface Auction {
  item_name: string;
  description: string;
  category: "electronics" | "art" | "fashion" | "vehicles" | "other";
  starting_price: number;
  buy_now?: number;
  start_time: string;
  end_time: string;
  status?: "ongoing" | "ended";
  images?: string[];
  condition: "new" | "used" | "refurbished";
}

const Countdown = ({ endTime }: { endTime: string }) => {
  const [timeLeft, setTimeLeft] = useState("");

  const updateCountdown = () => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      setTimeLeft("Ended");
      return;
    }

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    setTimeLeft(`${hours}h ${minutes}m`);
  };

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [endTime]);

  return <span>{timeLeft}</span>;
};

const AuctionCard = ({ auction }: { auction: Auction }) => {
  const imageSrc = auction.images?.[0]?.trim()
    ? auction.images[0]
    : FALLBACK_IMAGE;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image
          src={imageSrc}
          alt={auction.item_name}
          width={400}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {auction.item_name}
        </h3>
        <p className="text-sm text-gray-500 mb-2 capitalize">
          {auction.category} • {auction.condition}
        </p>
        <p className="text-orange-500 font-bold text-xl mb-2">
          Starting at ${auction.starting_price.toLocaleString()}
        </p>
        <div className="text-sm text-gray-600 flex justify-between items-center">
          <Countdown endTime={auction.end_time} />
          <span className="text-gray-500 capitalize">
            {auction.status || "ongoing"}
          </span>
        </div>
        <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white">
          Place Bid
        </Button>
      </div>
    </div>
  );
};

export default AuctionCard;
