/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { Switch } from "../../components/ui/switch";

const FALLBACK_IMAGE = "/fallback.jpg";

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
  const imageSrc = auction.images?.[0]?.trim() ? auction.images[0] : FALLBACK_IMAGE;

  const [notifyOutbid, setNotifyOutbid] = useState(false);

  const handleBidPlaced = (bidAmount: number, leaderboardPosition: number, totalBidders: number) => {
    toast.custom((t) => (
      <Dialog open={t.visible} onOpenChange={(open) => !open && toast.dismiss(t.id)}>
        <DialogContent className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">
          <DialogTitle className="text-center text-lg font-semibold text-green-600">
            Bid Placed!
          </DialogTitle>
    
          <DialogDescription className="mt-2 text-center text-sm text-gray-700">
            <p>Your bid: <span className="font-bold text-green-600">${bidAmount}</span></p>
          </DialogDescription>
    
          <DialogDescription className="mt-2 text-center text-sm text-gray-700">
            <p>You’re <span className="font-semibold text-indigo-600">#{leaderboardPosition}</span> out of {totalBidders} bidders!</p>
          </DialogDescription>
    
          <div className="flex items-center justify-center mt-4">
            <label htmlFor="notify" className="text-sm text-gray-700 mr-2">Notify me if outbid</label>
            <Switch
              id="notify"
              checked={notifyOutbid}
              onCheckedChange={(checked) => setNotifyOutbid(checked)}
              className="text-orange-500"
            />
          </div>
    
          <div className="mt-6 text-center">
            <Button onClick={() => toast.dismiss(t.id)} className="bg-orange-500 text-white">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    ));
  };

  const PlaceBid = () => {
    const bidAmount = 150; // Example bid amount
    const leaderboardPosition = 3; // Example leaderboard position
    const totalBidders = 12; // Example total bidders
    handleBidPlaced(bidAmount, leaderboardPosition, totalBidders);
  };

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
        <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white" onClick={PlaceBid}>
          Bid
        </Button>
      </div>
    </div>
  );
};

export default AuctionCard;
