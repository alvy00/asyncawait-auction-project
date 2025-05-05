"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const auctions = [
  {
    id: 1,
    title: "Vintage Rolex Submariner",
    description: "Rare 1960s Rolex Submariner in excellent condition",
    currentBid: 15250,
    endTime: "2025-05-06T12:00:00Z",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1287&q=80",
    category: "Jewelry"
  },
  {
    id: 2,
    title: "Abstract Oil Painting",
    description: "Original abstract artwork by contemporary artist",
    currentBid: 2100,
    endTime: "2025-05-04T23:00:00Z",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1290&q=80",
    category: "Art"
  },
  {
    id: 3,
    title: "Restored 1969 Ford Mustang",
    description: "Fully restored classic American muscle car",
    currentBid: 42500,
    endTime: "2025-05-06T23:00:00Z",
    image: "https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?auto=format&fit=crop&w=1287&q=80",
    category: "Cars"
  },
  {
    id: 4,
    title: "Beachfront Property",
    description: "Luxury beachfront villa with private access",
    currentBid: 1250000,
    endTime: "2025-05-07T23:00:00Z",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1170&q=80",
    category: "Real Estate"
  },
  {
    id: 5,
    title: "MacBook Pro M2 Max",
    description: "Latest model MacBook Pro with all accessories",
    currentBid: 2850,
    endTime: "2025-05-04T21:00:00Z",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1626&q=80",
    category: "Electronics"
  },
  {
    id: 6,
    title: "Rare Comic Book Collection",
    description: "First editions of Marvel classics in mint condition",
    currentBid: 8700,
    endTime: "2025-05-06T09:00:00Z",
    image: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=1160&q=80",
    category: "Collectibles"
  },
];

const CountdownTimer = ({ endTime }: { endTime: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: "--",
    hours: "--",
    minutes: "--",
    seconds: "--",
  });

  useEffect(() => {
    function calculateTimeLeft(endTime: string) {
      const difference = new Date(endTime).getTime() - Date.now();

      if (difference <= 0) {
        return {
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        };
      }

      return {
        days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, "0"),
        hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
        minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, "0"),
        seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
      };
    }

    const updateTimer = () => setTimeLeft(calculateTimeLeft(endTime));
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const isOver = timeLeft.days === "00" && timeLeft.hours === "00" && timeLeft.minutes === "00" && timeLeft.seconds === "00";

  return isOver ? (
    <span className="text-red-500 font-semibold">Auction Ended</span>
  ) : (
    <div className="flex space-x-2 text-sm font-medium">
      {timeLeft.days !== "00" && (
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">{timeLeft.days}</span>
          <span className="text-xs text-gray-500">days</span>
        </div>
      )}
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold">{timeLeft.hours}</span>
        <span className="text-xs text-gray-500">hrs</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold">{timeLeft.minutes}</span>
        <span className="text-xs text-gray-500">min</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold">{timeLeft.seconds}</span>
        <span className="text-xs text-gray-500">sec</span>
      </div>
    </div>
  );
};

const AuctionCard = ({ auction }: { auction: typeof auctions[0] }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="relative h-48 overflow-hidden">
      <div className="absolute top-2 right-2 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
        {auction.category}
      </div>
      <Image 
        src={auction.image} 
        alt={auction.title}
        width={400}
        height={200}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-5">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">{auction.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{auction.description}</p>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Current Bid</p>
          <p className="text-xl font-bold text-orange-500">${auction.currentBid.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-right">Ends in</p>
          <CountdownTimer endTime={auction.endTime} />
        </div>
      </div>
      <div className="flex space-x-2">
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Place Bid</Button>
        <Button variant="outline" className="border-gray-300 dark:border-gray-600">Watch</Button>
      </div>
    </div>
  </div>
);

const LiveAuctionsSection = () => (
  <section className="py-16 bg-gray-50 dark:bg-gray-900">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Live Auctions</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Bid on these hot items before they&apos;re gone!</p>
        </div>
        <Link href="/auctions/live" className="text-orange-500 hover:text-orange-600 font-medium flex items-center">
          View All
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {auctions.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  </section>
);

export default LiveAuctionsSection;
