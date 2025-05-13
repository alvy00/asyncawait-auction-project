import React from 'react'
import UpcomingAuctionCard from '../../../components/UpcomingAuctionCard'

const exampleAuctions = [
  {
    auction_id: 1,
    item_name: 'Rare Crypto Art #204',
    description: 'One-of-a-kind digital masterpiece by ArtVinci.',
    images: ['/images/art-1.jpg'],
    start_time: '2025-06-01T15:00:00Z',
    end_time: '2025-06-01T17:00:00Z',
    starting_price: 1200,
    status: 'upcoming',  // Use the correct value
    highest_bid: null,
    highest_bidder_id: null,
    creator: 'ArtVinci',
    category: 'Art',
    seller: 'ArtVinciGallery',
    condition: 'New',
  },
  {
    auction_id: 2,
    item_name: 'Vintage Rolex Submariner',
    description: 'A timeless classic for collectors.',
    images: ['/images/watch-1.jpg'],
    start_time: '2025-06-02T10:00:00Z',
    end_time: '2025-06-02T14:00:00Z',
    starting_price: 8500,
    status: 'live',  // Use the correct value
    highest_bid: null,
    highest_bidder_id: null,
    creator: 'CollectorX',
    category: 'Watches',
    seller: 'VintageTimepiecesInc',
    condition: 'Used',
  },
  {
    auction_id: 3,
    item_name: 'Lamborghini Aventador Diecast',
    description: 'Rare 1:18 scale model in pristine condition.',
    images: ['/images/car-1.jpg'],
    start_time: '2025-06-03T20:00:00Z',
    end_time: '2025-06-03T23:00:00Z',
    starting_price: 300,
    status: 'upcoming',  // Use the correct value
    highest_bid: null,
    highest_bidder_id: null,
    creator: 'DiecastWorld',
    category: 'Collectibles',
    seller: 'CollectorDepot',
    condition: 'New',
  },
];



const UpcomingAuctions = () => {
  return (
    <div className="py-16 bg-gradient-to-r from-black via-[#0a0a18] to-[#0a0a18] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Upcoming Auctions</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {exampleAuctions.map((auction, index) => (
            <UpcomingAuctionCard key={index} auction={auction} auctionCreator='Random'/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UpcomingAuctions
