import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import Image from "next/image";
import toast from "react-hot-toast";
import { Auction } from "../../lib/interfaces";

const FALLBACK_IMAGE = "/fallback.jpg";

const Countdown = ({ endTime, onComplete }: { endTime: string, onComplete?: () => void }) => {
  const [timeLeft, setTimeLeft] = useState("");

  const updateCountdown = () => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      setTimeLeft("---");
      onComplete?.();
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

const handleBidPlaced = (bidAmount: number, leaderboardPosition: number, totalBidders: number) => {
  toast.custom((t) => (
    <Dialog open={t.visible} onOpenChange={(open) => !open && toast.dismiss(t.id)}>
      <DialogContent className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">
        <DialogTitle className="text-center text-lg font-semibold text-green-600">
          Bid Placed!
        </DialogTitle>

        <DialogDescription className="mt-2 text-center text-sm text-gray-700">
          Your bid: <span className="font-bold text-green-600">${bidAmount}</span><br />
          You’re <span className="font-semibold text-indigo-600">#{leaderboardPosition}</span> out of {totalBidders} bidders!
        </DialogDescription>

        <div className="flex items-center justify-center mt-4">
          <label htmlFor="notify" className="text-sm text-gray-700 mr-2">Notify me if outbid</label>
        </div>
        
      </DialogContent>
    </Dialog>
  ));
};

const AuctionCard = ({ auction, auctionCreator}: { auction: Auction, auctionCreator: string }) => {
  const imageSrc = auction.images?.[0]?.trim() ? auction.images[0] : FALLBACK_IMAGE;
  const [isEnded, setIsEnded] = useState(false);

  return (
    <div className="bg-[#1a1f2a] rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 hover:shadow-lg">
      
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
        <h3 className="text-lg font-semibold text-gray-800 mb-1 text-white">{auction.item_name}</h3>
        <p className="text-sm text-gray-400 mb-2 capitalize">
          {auction.category} • {auction.condition}
        </p>
        <p className="text-orange-500 font-bold text-xl mb-2">
          Starting at ${auction.starting_price.toLocaleString()}
        </p>

        <div className="text-sm text-gray-600 flex justify-between items-center mb-3">
          <Countdown endTime={auction.end_time} onComplete={() => setIsEnded(true)}/>
          <span
            className={`capitalize font-medium ${
              isEnded ? "text-red-500" : "text-green-600"
            }`}
          >
            {isEnded ? "Ended" : (auction.status || "Ongoing")}
          </span>
        </div>
        
        {/* Seller info */}
        <div className="flex items-center text-gray-400 text-xs mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {auctionCreator}
        </div>

        {/* Bid button */}
        <Button 
          onClick={() => handleBidPlaced(300, 4, 59)}
          className="w-full bg-transparent hover:bg-gray-700 text-white border border-gray-600 transition-all duration-300"
        >
          Bid Now
        </Button>

      </div>
    </div>
  );
};

export default AuctionCard;
