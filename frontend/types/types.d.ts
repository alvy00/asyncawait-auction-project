export type Auction = {
    item_name: string;
    description: string;
    category: 'electronics' | 'art' | 'fashion' | 'vehicles' | 'other';
    starting_price: number;
    buy_now?: number;
    start_time: Date;
    end_time: Date;
    status: 'ongoing' | 'ended';
    images?: string[];
    condition: 'new' | 'used' | 'refurbished';
};