/* eslint-disable @typescript-eslint/no-unused-vars */
export interface User {
    name: string;
    email: string;
    money: number;
    total_bids: number;
    bids_won: number;
}

export interface Auction{
  auction_id: string;
  creator: string;
  item_name: string;
  description: string;
  category: "electronics" | "art" | "fashion" | "vehicles" | "other";
  starting_price: number;
  buy_now?: number;
  highest_bid?: number;
  highest_bidder_id?: string;
  start_time: string;
  end_time: string;
  status?: "upcoming" | "ongoing" | "ended";
  images?: string[];
  condition: "new" | "used" | "refurbished";
  onFavorite?: (id: string | number, isFavorite: boolean) => void;
  isFavorite?: boolean;
}

export interface PastAuctionCardProps{
  item_name: string;
  winner: string;
  sold_price: number;
  image: string;
  ended_on: string;
};

export interface UpcomingAuctionCardProps{
  auction: {
    auction_id: number;
    item_name: string;
    description: string;
    images: string[];
    start_time: string;
    end_time: string;
    starting_price: number;
    status: 'upcoming' | 'live' | 'ended';
    highest_bid: number | null;
    highest_bidder_id: number | null;
    creator: string;
    category: string;
    condition: 'New' | 'Used';
  };
  auctionCreator: string;
};
