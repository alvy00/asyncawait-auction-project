import express from 'express'
import supabase from '../../config/supabaseClient.js';
import { auctionSchema } from '../../utils/schema.js';
import { getUser } from '../controllers/authController.js';


const auctionRouter = express.Router();

// Get all auctions
auctionRouter.get('/', async (req, res) => {
    try {
        const currentTime = new Date();
        const { data, error } = await supabase.from('auctions').select('*');

        // Update status of auctions
        await supabase
        .from('auctions')
        .update({ status: 'ended' })
        .eq('status', 'ongoing')
        .lt('end_time', currentTime);

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        res.status(200).json(data);
    } catch (e) {
        console.console('Error fetching auctions:', e);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Create Auction
auctionRouter.post('/create', async (req, res) => {
    try {
        const user = await getUser(req);

        //const { user_id } = req.body;
        //console.log(user)

        if (!user) return res.status(401).json({ error: 'Unauthorized' });
        
        const result = auctionSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: 'Invalid auction data',
                issues: result.error.issues,
            });
        }


       console.log(result)
        const { data, error } = await supabase
            .from('auctions')
            .insert([
                {
                    user_id: user.id,
                    ...result.data,
                },
            ]).select();

        console.log("Supabase Response:", { data, error });
        //console.log(user);

        console.log("Inserted auction from Supabase:", data);

        if (error) {
            return res.status(500).json({
                error: 'Database Insert Failed',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            return res.status(500).json({
                error: 'Database Insert Returned No Data',
                message: 'Failed to create auction, no data returned.',
            });
        }

        res.status(201).json({
            message: 'Auction created successfully',
            auction: data[0],
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: e.message || 'An error occurred while creating the auction',
        });
    }
});


// Get Auction Details by ID
auctionRouter.post('/aucdetails', async (req, res) => {
  const { auction_id } = req.body;

  if (!auction_id) return res.status(400).json({ message: "Missing 'auction_id' in request body." });


  try {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .eq('auction_id', auction_id)
      .single();

    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(500).json({ message: "Error fetching auction details." });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ message: "Unexpected server error." });
  }
});


// Place Bid
auctionRouter.post('/bid', async (req, res) => {
    try {
        //const { auction_id, amount, highest_bid, user_id } = req.body;
        const { auction_id, amount } = req.body;
        const user = await getUser(req);

        if (!user) {
            console.error('Unauthorized user');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { data: auction, error: auctionErr } = await supabase
            .from('auctions')
            .select('*')
            .eq('auction_id', auction_id)
            .single();

        if (auctionErr) {
            console.error('Auction not found:', auctionErr);
            return res.status(400).json({ message: 'Auction not found!' });
        }

        if (new Date() > new Date(auction.end_time)) {
            console.error('Auction has ended');
            return res.status(400).json({ message: 'Auction has ended :(' });
        }

        if (amount <= auction.highest_bid) {
            console.error(`Bid is too low. Current highest bid is ${auction.highest_bid}`);
            return res.status(401).json({ message: `Bid must be higher than the current highest bid ($${auction.highest_bid})` });
        }

        if (isNaN(amount) || amount <= 0) {
            console.error('Invalid bid amount:', amount);
            return res.status(400).json({ message: 'Please enter a valid bid amount' });
        }

        // Start a transaction
        const { data: bid, error: bidErr } = await supabase
            .rpc('place_bid_transaction', {
                p_auction_id: auction_id,
                p_bid_amount: amount,
                p_highest_bid: auction.highest_bid,
                p_user_id: user.id
            });

        // // Start a MOCK Transaction
        // const { data: bid, error: bidErr } = await supabase
        //     .rpc('place_bid_transaction', {
        //         p_auction_id: auction_id,
        //         p_bid_amount: amount,
        //         p_highest_bid: highest_bid,
        //         p_user_id: user_id
        //     });

        if (bidErr) {
            console.error('Error placing bid:', bidErr);
            return res.status(400).json({ message: 'Bid could not be placed!', error: bidErr });
        }

        console.log('Bid placed successfully:', bid);
        return res.status(200).json({ message: 'Bid placed!' });

    } catch (e) {
        console.error('Error in place bid route:', e);
        return res.status(500).json({ message: 'Something went wrong!' });
    }
});


// Get User Bid History
auctionRouter.post('/bidhistory', async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id in request body' });
  }

  const { data, error } = await supabase
    .from('bids')
    .select('*')
    .eq('user_id', user_id);

  if (error) {
    console.error('Error fetching bids:', error.message);
    return res.status(500).json({ error: 'Failed to fetch bid history' });
  }

  // Format date
  const formatted = data.map((bid) => ({
    ...bid,
    created_at: new Date(bid.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }), // e.g., "May 10, 2025"
  }));

  return res.status(200).json(formatted);
});


// Favourite Auctions
auctionRouter.post('/favourite', async (req, res) => {
    try{
        const { auction_id, user_id } = req.body;

        const { data, error } = await supabase
            .from('user_favorites')
            .insert([{ user_id: user_id, auction_id: auction_id }]);

        if (error) {
            console.error('Error favoriting auction:', error);
            return res.status(400).json({ message: 'Error favoriting auction', error });
        }

        return res.status(200).json({ message: 'Auction favorited successfully', data });
    }catch(e){
        console.error('Error in favorite auction route:', e);
        return res.status(500).json({ message: 'Something went wrong' });
    }
});


// Unfavorite Auctions
auctionRouter.post('/unfavourite', async (req, res) => {
  try {
    const { auction_id, user_id } = req.body;

    const { data, error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', user_id)
      .eq('auction_id', auction_id);

    if (error) {
      console.error('Error unfavoriting auction:', error);
      return res.status(400).json({ message: 'Error unfavoriting auction', error });
    }

    return res.status(200).json({ message: 'Auction unfavorited successfully', data });
  } catch (e) {
    console.error('Error in unfavorite auction route:', e);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});


// Fetch All Favourite Auction IDs for a User
auctionRouter.post('/favauctions', async (req, res) => {
  try {
    const user_id = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'Missing user_id' });
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .select('auction_id')
      .eq('user_id', user_id);

    if (error) {
      console.error('Supabase error:', error.message);
      return res.status(500).json({ message: 'Failed to fetch favourites', error });
    }

    const auctionIds = data.map(fav => fav.auction_id);
    return res.status(200).json(auctionIds);
  } catch (e) {
    console.error('Server error:', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default auctionRouter;