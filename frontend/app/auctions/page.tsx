"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../../components/ui/button";

// Default fallback image
const FALLBACK_IMAGE = "https://via.placeholder.com/400x200?text=No+Image";

// Dummy data
const auctions = [
  {
    id: 1,
    title: "Vintage Rolex Submariner",
    currentBid: 15250,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa",
    endTime: "2025-05-10T12:00:00Z",
    bidders: 3,
    highestBidderAvatar: "https://i.pravatar.cc/40?img=8",
  },
  {
    id: 2,
    title: "Rare Comic Collection",
    currentBid: 4200,
    image: "",
    endTime: "2025-05-11T18:00:00Z",
    bidders: 1,
    highestBidderAvatar: "https://i.pravatar.cc/40?img=15",
  },
  {
    id: 3,
    title: "Beachfront Villa",
    currentBid: 985000,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
    endTime: "2025-05-13T20:00:00Z",
    bidders: 5,
    highestBidderAvatar: "",
  },
];

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

const AuctionCard = ({ auction }: { auction: typeof auctions[0] }) => {
  const imageSrc = auction.image?.trim()
    ? auction.image
    : FALLBACK_IMAGE;
  const avatar = auction.highestBidderAvatar?.trim()
    ? auction.highestBidderAvatar
    : "https://i.pravatar.cc/40";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg relative">
      {/* Avatar */}
      <div className="absolute top-2 right-2 z-10">
        <Image
          src={avatar}
          alt="Highest bidder"
          width={40}
          height={40}
          className="rounded-full border-2 border-white shadow"
        />
      </div>

      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={imageSrc}
          alt={auction.title}
          width={400}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{auction.title}</h3>
        <p className="text-orange-500 font-bold text-xl mb-2">${auction.currentBid.toLocaleString()}</p>
        <div className="text-sm text-gray-600 flex justify-between items-center">
          <Countdown endTime={auction.endTime} />
          <span className="text-red-500 font-medium">🔥 {auction.bidders} bidder{auction.bidders !== 1 && "s"}</span>
        </div>
        <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white">
          Place Bid
        </Button>
      </div>
    </div>
  );
};

const AuctionListingPage = () => {
  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">All Auctions</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AuctionListingPage;
