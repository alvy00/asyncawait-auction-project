import express from 'express'
import supabase from '../../config/supabaseClient.js';
import { auctionSchema } from '../../utils/schema.js';
import { getUser } from '../controllers/authController.js';


const auctionRouter = express.Router();


// -------------------------------------- AUCTIONS -------------------------------------------------

// Get All Auctions
auctionRouter.get('/', async (req, res) => {
    try {
        const currentTime = new Date();


        const { data, error } = await supabase.from('auctions').select('*').order('created_at', {ascending: false});

        // Update status
        await supabase
        .from('auctions')
        .update({ status: 'ended' })
        .eq('status', 'live')
        .lt('end_time', currentTime);

        if (error) {
            return res.status(400).json({ message: error.message, data: data});
        }

        res.status(200).json(data);
    } catch (e) {
        console.console('Error fetching auctions:', e);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get FEATURED Auctions
auctionRouter.get('/featured', async (req, res) => {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .gte('end_time', now)
      .order('total_bids', { ascending: false })
      .order('starting_price', { ascending: false })
      .limit(6);

    if (error) {
      return res.status(400).json({ message: "Error fetching featured auctions" });
    }

    return res.status(200).json(data);

  } catch (e) {
    console.log("Something went wrong!", e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Create Auction
auctionRouter.post('/create', async (req, res) => {
    try {
        const user = await getUser(req);
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
                data: data
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

        console.log('Data to insert:', result.data);
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: e.message || 'An error occurred while creating the auction',
        });
    }
});

// Delete Auction
auctionRouter.delete('/delete', async (req, res) => {
  try {
    const { auction_id } = req.body;

    if (!auction_id) {
      return res.status(400).json({ message: 'auction_id is required' });
    }

    const { data, error } = await supabase
      .from('auctions')
      .delete()
      .eq('auction_id', auction_id);

    if (error) {
      return res.status(400).json({ message: 'Error deleting auction', error, data: data });
    }

    return res.status(200).json({ message: 'Auction deleted successfully', data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Update Auction Status and increment spent_on_bids if ended
auctionRouter.post('/updatestatus', async (req, res) => {
  const { auction_id, status } = req.body;

  if (!auction_id || !status) {
    return res.status(400).json({ message: "Missing auction_id or status" });
  }

  try {
    const { data: auction, error: updateError } = await supabase
      .from('auctions')
      .update({ status })
      .eq('auction_id', auction_id)
      .select('highest_bid, highest_bidder_id')
      .single();

    if (updateError) {
      return res.status(400).json({ message: "Failed to update auction status", error: updateError, data: data });
    }

    if (status === 'ended' && auction?.highest_bidder_id && auction?.highest_bid) {
      const { highest_bid, highest_bidder_id } = auction;

      const { error: rpcError } = await supabase.rpc('increment_user_spent_on_bids', {
        user_uuid: highest_bidder_id,
        increment_amount: highest_bid,
      });

      if (rpcError) {
        return res.status(400).json({
          message: "Auction status updated but failed to increment user's spent_on_bids",
          error: rpcError,
        });
      }
    }

    return res.status(200).json({ message: "Auction status updated successfully" });
  } catch (err) {
    console.error("Unexpected error in /updatestatus:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch Auction Details by ID
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
      return res.status(500).json({ message: "Error fetching auction details.", data: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ message: "Unexpected server error." });
  }
});

// GET /auctions/:id
auctionRouter.get('/:id', async (req, res) => {
  const auction_id = req.params.id;

  try {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .eq('auction_id', auction_id)
      .single();

    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(500).json({ message: "Error fetching auction details.", data: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ message: "Unexpected server error." });
  }
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
            return res.status(400).json({ message: 'Error favoriting auction', error, data: data });
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
      return res.status(400).json({ message: 'Error unfavoriting auction', error, data: data });
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
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'Missing user_id' });
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .select('auction_id')
      .eq('user_id', user_id);

    if (error) {
      console.error('Supabase error:', error.message);
      return res.status(500).json({ message: 'Failed to fetch favourites', error, data: data });
    }

    const auctionIds = data.map(fav => fav.auction_id);
    console.log(auctionIds);
    return res.status(200).json(auctionIds);
  } catch (e) {
    console.error('Server error:', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// -------------------------------------- BIDS -------------------------------------------------

// Place Exact Bid (Dutch)
auctionRouter.post('/bidcurrent', async (req, res) => {
  try {
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

    if (auctionErr || !auction) {
      console.error('Auction not found:', auctionErr);
      return res.status(400).json({ message: 'Auction not found!', data: data });
    }

    const now = new Date();

    if (now > new Date(auction.end_time)) {
      console.error('Auction has ended');
      return res.status(400).json({ message: 'Auction has ended :(' });
    }

    if (now < new Date(auction.start_time)) {
      console.error('Auction has not started yet');
      return res.status(400).json({ message: 'Auction has not started yet' });
    }

    if (isNaN(amount) || amount <= 0) {
      console.error('Invalid bid amount:', amount);
      return res.status(400).json({ message: 'Please enter a valid bid amount' });
    }

    // bid transaction RPC
    const { data: bid, error: bidErr } = await supabase.rpc('place_bid_transaction', {
      p_auction_id: auction_id,
      p_bid_amount: amount,
      p_highest_bid: auction.highest_bid,
      p_user_id: user.id,
    });

    const { data, error } = await supabase
      .from('auctions')
      .update({ end_time: now, status: 'ended' })
      .eq('auction_id', auction_id);
    if (error) {
      console.error("Failed to end auction:", error.message);
    } else {
      console.log("Auction successfully ended:", data);
    }

    if (bidErr) {
      console.error('Error placing bid:', bidErr);
      return res.status(400).json({ message: 'Bid could not be placed!', error: bidErr, data: data });
    }

    console.log('Bid placed successfully:', bid);
    return res.status(200).json({ message: 'Bid placed!' });

  } catch (e) {
    console.error('Error in place bid route:', e);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
});

// Place Higher Bid (Regular, Blitz)
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
            return res.status(400).json({ message: 'Auction not found!', data: auction });
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
            return res.status(400).json({ message: 'Bid could not be placed!', error: bidErr, data: bid });
        }

        console.log('Bid placed successfully:', bid);
        return res.status(200).json({ message: 'Bid placed!' });

    } catch (e) {
        console.error('Error in place bid route:', e);
        return res.status(500).json({ message: 'Something went wrong!' });
    }
});

// Place Lower Bid (Reverse)
auctionRouter.post('/bidlow', async (req, res) => {
  try {
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

    if (auctionErr || !auction) {
      console.error('Auction not found:', auctionErr);
      return res.status(400).json({ message: 'Auction not found!', data: auction });
    }

    if (new Date() > new Date(auction.end_time)) {
      console.error('Auction has ended');
      return res.status(400).json({ message: 'Auction has ended :(' });
    }

    if (isNaN(amount) || amount <= 0) {
      console.error('Invalid bid amount:', amount);
      return res.status(400).json({ message: 'Please enter a valid bid amount' });
    }

      const currentLowestBid = auction.highest_bid > 0 ? auction.highest_bid : auction.starting_price;

    if (Number(amount) >= currentLowestBid) {
      console.error(`Bid too high. Current lowest bid is $${currentLowestBid}`);
      return res.status(401).json({
        message: `Your bid must be lower than the current lowest bid ($${currentLowestBid})`,
      });
    }

    const { data: bid, error: bidErr } = await supabase.rpc('place_bid_transaction', {
      p_auction_id: auction_id,
      p_bid_amount: amount,
      p_highest_bid: currentLowestBid,
      p_user_id: user.id,
    });

    if (bidErr) {
      console.error('Error placing bid:', bidErr);
      return res.status(400).json({ message: 'Bid could not be placed!', error: bidErr, data: bid });
    }

    console.log('Lower bid placed successfully:', bid);
    return res.status(200).json({ message: 'Lower bid placed!' });

  } catch (e) {
    console.error('Error in reverse auction bid route:', e);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
});

// Place Hidden Bid (Phantom)
auctionRouter.post('/bidhidden', async (req, res) => {
  try {
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
      return res.status(400).json({ message: 'Auction not found!', data: auction });
    }

    if (new Date() > new Date(auction.end_time)) {
      console.error('Auction has ended');
      return res.status(400).json({ message: 'Auction has ended :(' });
    }

    if (isNaN(amount) || amount <= 0) {
      console.error('Invalid bid amount:', amount);
      return res.status(400).json({ message: 'Please enter a valid bid amount' });
    }

    const { data: bid, error: bidErr } = await supabase.rpc('place_bid_trans_hidden', {
      p_auction_id: auction_id,
      p_user_id: user.id,
      p_bid_amount: amount,
    });

    if (bidErr) {
      console.error('Error placing hidden bid:', bidErr);
      return res.status(400).json({ message: 'Bid could not be placed!', error: bidErr, data: bid });
    }

    console.log('Hidden bid placed successfully:', bid);
    return res.status(200).json({ message: 'Bid placed!' });

  } catch (e) {
    console.error('Error in place hidden bid route:', e);
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
    return res.status(500).json({ error: 'Failed to fetch bid history', data: data });
  }

  const formatted = data.map((bid) => ({
    ...bid,
    created_at: new Date(bid.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  }));

  return res.status(200).json(formatted);
});


// Get Top Bids
auctionRouter.post('/topbids', async (req, res) => {
  const { auction_id } = req.body;

  if (!auction_id) {
    return res.status(400).json({ message: "Auction id required!" });
  }

  try {
    const { data, error } = await supabase
      .from('bids')
      .select(`
        bid_amount,
        created_at,
        users(name)
      `)
      .eq('auction_id', auction_id)
      .order('amount', { ascending: false })
      .limit(5);

    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Supabase query failed", error });
    }

    const topBids = data.map(bid => ({
      amount: bid.amount,
      name: bid.users?.name || "Unknown",
      created_at: bid.created_at,
    }));

    return res.status(200).json(topBids);
  } catch (e) {
    console.error('Unexpected error:', e);
    return res.status(500).json({ message: "Server error" });
  }
});


export default auctionRouter;