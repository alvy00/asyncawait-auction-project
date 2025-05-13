import React from 'react';
import Image from 'next/image';
import { PastAuctionCardProps } from '../../lib/interfaces';

const PastAuctionCard: React.FC<PastAuctionCardProps> = ({
  item_name,
  winner,
  sold_price,
  image,
  ended_on,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative aspect-[4/3]">
        <Image src={image} alt={item_name} fill className="object-cover" />
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold text-white mb-1">{item_name}</h2>
        <p className="text-sm text-gray-400 mb-2">
          Ended on: {new Date(ended_on).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-400">
          Winner: <span className="font-semibold text-green-400">{winner}</span>
        </p>
        <p className="text-sm text-gray-300 mt-1">
          Final Price: <span className="font-semibold text-orange-400">${sold_price.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
};

export default PastAuctionCard;
