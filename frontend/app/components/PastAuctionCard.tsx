/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { PastAuctionCardProps } from '../../lib/interfaces';

const PastAuctionCard: React.FC<PastAuctionCardProps> = ({ auction }) => {
  const firstImage = (auction.images && auction.images.length > 0) ? auction.images[0] : "/fallback.jpg";
  const [winner, setWinner] = useState(null);

  // get highest bidder
  useEffect(() => {
    const getHighestBidder = async () => {
      const userId = auction?.highest_bidder_id;

      if (!userId) {
        console.log("Missing highest_bidder_id");
        return;
      }

      try {
        // https://asyncawait-auction-project.onrender.com/api/fetchuser
        // http://localhost:8000/api/fetchuser
        const res = await fetch('https://asyncawait-auction-project.onrender.com/api/fetchuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });

        if (!res.ok) {
          const errorBody = await res.text(); // Use .text() to see raw response
          console.error('Failed to fetch user. Status:', res.status, 'Response:', errorBody);
          return;
        }

        const data = await res.json();
        //console.log('Fetched user:', data.name);
        setWinner(data.name);
        return data;
      } catch (err) {
        console.error('Fetch exception:', err);
      }
    };

    getHighestBidder();
  }, [auction?.highest_bidder_id])

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative aspect-[4/3]">
        <Image src={firstImage} alt={auction.item_name} fill className="object-cover" />
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold text-white mb-1">{auction.item_name}</h2>
        <p className="text-sm text-gray-400 mb-2">
          Ended on: {auction.end_time ? new Date(auction.end_time).toLocaleDateString() : "Unknown date"}
        </p>
        <p className="text-sm text-gray-400">
          Winner: {winner? (
            <span className="font-semibold text-green-400">{winner}</span>
          ) : (
            <span className="font-semibold text-red-400">No one bidded :(</span>
          ) }
        </p>
        <p className="text-sm text-gray-300 mt-1">
          Final Price:{" "}
            <span className="font-semibold text-orange-400">
              {auction.highest_bid != null && Number(auction.highest_bid) !== 0
                ? `$${Number(auction.highest_bid).toLocaleString()}`
                : "N/A"}
            </span>
        </p>
      </div>
    </div>
  );
};

export default PastAuctionCard;
