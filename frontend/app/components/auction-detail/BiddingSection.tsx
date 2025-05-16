"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";

interface BiddingSectionProps {
  currentBid: number;
  onBid: (amount: number) => void;
}

const BiddingSection = ({ currentBid, onBid }: BiddingSectionProps) => {
  const [bidAmount, setBidAmount] = useState(currentBid + 5);

  const handleIncreaseBid = () => {
    setBidAmount(prev => prev + 5);
  };

  const handleDecreaseBid = () => {
    if (bidAmount > currentBid) {
      setBidAmount(prev => prev - 5);
    }
  };

  const handleBid = () => {
    onBid(bidAmount);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button 
          className="bg-[#010915] border border-gray-700 rounded p-2"
          onClick={handleIncreaseBid}
        >
          <Plus className="h-5 w-5" />
        </button>
        <div className="bg-[#010915] border border-gray-700 rounded px-4 py-2 min-w-[120px] text-center">
          ${bidAmount.toFixed(2)}
        </div>
        <button 
          className="bg-[#010915] border border-gray-700 rounded p-2"
          onClick={handleDecreaseBid}
        >
          <Minus className="h-5 w-5" />
        </button>
        <button 
          className="bg-[#ef863f] hover:bg-[#e27933] text-white font-medium rounded px-6 py-2"
          onClick={handleBid}
        >
          Bid
        </button>
      </div>

      <div className="bg-[#010915] border border-gray-700 rounded p-4 mb-4">
        <div className="text-sm text-center mb-2">Guaranteed Safe Checkout</div>
        <div className="flex justify-center gap-2">
          <Image
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=60&auto=format&fit=crop"
            alt="PayPal"
            width={60}
            height={30}
            className="object-contain"
          />
          <Image
            src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=60&auto=format&fit=crop"
            alt="Stripe"
            width={60}
            height={30}
            className="object-contain"
          />
          <Image
            src="https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?q=80&w=60&auto=format&fit=crop"
            alt="Visa"
            width={60}
            height={30}
            className="object-contain"
          />
          <Image
            src="https://images.unsplash.com/photo-1556742205-e10c9486e506?q=80&w=60&auto=format&fit=crop"
            alt="Verifone"
            width={60}
            height={30}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default BiddingSection;