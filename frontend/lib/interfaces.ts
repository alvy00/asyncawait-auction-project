 export interface User {
    username: string;
    user_id: string;
    name: string;
    email: string;
    image_url: string;
    bio: string;
    join_date: string;
    money: number;
    total_deposits: number;
    total_withdrawals: number;
    spent_on_bids: number;
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
  auction_type: string;
  user_id?: string;
  creator: string;
  item_name: string;
  description: string;
  category: "electronics" | "art" | "fashion" | "vehicles" | "other";
  starting_price: number;
  buy_now?: number;
  highest_bid?: number;
  highest_bidder_id?: string;
  highest_bidder_name?: string;
  total_bids: string;
  created_at: string;
  start_time: string;
  end_time: string;
  participants: string;
  status?: string;
  images?: string[];
  condition: "new" | "used" | "refurbished";
  isFavorite?: boolean;
  top_bidders?: Array<{
    name: string;
    avatar: string;
    amount: number;
  }>;
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
