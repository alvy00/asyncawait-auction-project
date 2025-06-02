/* eslint-disable @typescript-eslint/no-unused-vars */
export interface User {
    user_id: string;
    name: string;
    email: string;
    join_date: string;
    money: number;
    total_auctions: number;
    total_bids: number;
    auctions_participated: number;
    auctions_won: number;
    win_rate: number;
    is_admin: boolean;
    is_suspended: boolean;
}

export interface Auction {
  auction_id: string;
  user_id?: string;
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
  status?: string;
  images?: string[];
  condition: "new" | "used" | "refurbished";
  onFavorite?: (id: string | number, isFavorite: boolean) => void;
  isFavorite?: boolean;
}

export interface PastAuctionCardProps{
  auction: Auction;
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
