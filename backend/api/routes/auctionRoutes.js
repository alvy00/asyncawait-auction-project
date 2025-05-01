import express from 'express'
import supabase from '../../config/supabaseClient.js';


const auctionRouter = express.Router();

// Get all auctions
auctionRouter.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('auctions').select('*');

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        res.status(200).json(data);
    } catch (e) {
        console.console('Error fetching auctions:', e);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default auctionRouter;