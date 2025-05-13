'use client';

import React from 'react';
import Image from 'next/image';

const pastAuctions = [
  {
    auction_id: 101,
    item_name: 'Signed Kobe Bryant Jersey',
    winner: 'JordanFan88',
    sold_price: 12000,
    image: '/images/jersey.jpg',
    ended_on: '2025-05-10T18:00:00Z',
  },
  {
    auction_id: 102,
    item_name: 'Antique Typewriter',
    winner: 'RetroCollector',
    sold_price: 475,
    image: '/images/typewriter.jpg',
    ended_on: '2025-05-08T15:30:00Z',
  },
  {
    auction_id: 103,
    item_name: 'Rare Pikachu Illustrator Card',
    winner: 'PokeKing',
    sold_price: 78000,
    image: '/images/pokemon-card.jpg',
    ended_on: '2025-05-05T20:45:00Z',
  },
  {
    auction_id: 104,
    item_name: 'Apollo 11 Mission Patch',
    winner: 'SpaceHistory',
    sold_price: 1950,
    image: '/images/apollo-patch.jpg',
    ended_on: '2025-05-03T13:00:00Z',
  },
  {
    auction_id: 105,
    item_name: 'Custom Electric Guitar',
    winner: 'StratMaster',
    sold_price: 2300,
    image: '/images/guitar.jpg',
    ended_on: '2025-05-01T11:00:00Z',
  },
];

const PastAuctions = () => {
  return (
    <div className="py-16 bg-gradient-to-r from-black via-[#0a0a18] to-[#0a0a18] text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-10 text-center">Past Auctions</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pastAuctions.map((auction) => (
            <div
              key={auction.auction_id}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={auction.image}
                  alt={auction.item_name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold text-white mb-1">
                  {auction.item_name}
                </h2>
                <p className="text-sm text-gray-400 mb-2">
                  Ended on: {new Date(auction.ended_on).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400">
                  Winner: <span className="font-semibold text-green-400">{auction.winner}</span>
                </p>
                <p className="text-sm text-gray-300 mt-1">
                  Final Price: <span className="font-semibold text-orange-400">${auction.sold_price.toLocaleString()}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PastAuctions;
