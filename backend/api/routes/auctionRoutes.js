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
        //console.log(user)

        if (!user) return res.status(401).json({ error: 'Unauthorized' });
        
        const result = auctionSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: 'Invalid auction data',
                issues: result.error.issues,
            });
        }
       // console.log(result)
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


// Place Bid
auctionRouter.post('/bid', async (req, res) => {
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

        if (bidErr) {
            console.error('Error placing bid:', bidErr);
            return res.status(400).json({ message: 'Bid could not be placed!' });
        }

        console.log('Bid placed successfully:', bid);
        return res.status(200).json({ message: 'Bid placed!' });

    } catch (e) {
        console.error('Error in place bid route:', e);
        return res.status(500).json({ message: 'Something went wrong!' });
    }
});


export default auctionRouter;