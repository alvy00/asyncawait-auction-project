import express from 'express'
import supabase from '../../config/supabaseClient.js';
import { auctionSchema } from '../../utils/schema.js';


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

//Create Auction
auctionRouter.post('/create', async (req, res) => {
    try{
        const result = auctionSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                error: 'Invalid auction data',
                issues: result.error.issues,
            })
        }

        res.status(201).json({
            message: 'Auction created successfully',
            auction: result.data,
        })
    }catch(e){
        console.error(e);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: e.message || 'An error occurred while creating the auction',
        });
    }
})

export default auctionRouter;