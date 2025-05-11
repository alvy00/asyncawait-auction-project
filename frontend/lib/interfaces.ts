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
  status?: "ongoing" | "ended";
  images?: string[];
  seller: string;
  condition: "new" | "used" | "refurbished";
}