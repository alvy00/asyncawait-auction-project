import supabase from '../../config/supabaseClient.js';
import express from 'express'
import dotenv from 'dotenv'


dotenv.config();
const adminRouter = express.Router();

// Stats
adminRouter.get('/stats', async (req, res) => {
    try{
      
      const { count: userCount, error: userError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      if (userError) return res.status(400).json({ message: "Error counting users", data: userCount });

      const { count: auctionCount, error: auctionError } = await supabase
        .from('auctions')
        .select('*', { count: 'exact', head: true });
      if (auctionError) return res.status(400).json({ message: "Error counting auctions", data: auctionCount });

      const { count: bidCount, error: bidError } = await supabase
        .from('bids')
        .select('*', { count: 'exact', head: true });
      if (bidError) return res.status(400).json({ message: "Error counting bids", data: bidCount });

        // total successful transactions 
        // total cancellations after winning the auction
        // total reported users

      const result = {userCount, auctionCount, bidCount, generatedAt: new Date().toISOString()};
      return res.status(200).json(result);
    }catch(e){
      console.error(e);
      return res.status(500).json({ message: "Internal server error" });
    }
})

// -------------------------------------- USERS -------------------------------------------------

// Get All Users
adminRouter.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      return res.status(400).json({ message: "Error occurred", error, data: data });
    }

    return res.status(200).json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error", error: e });
  }
});

// Get User by ID
adminRouter.get('/users/:id', async (req, res) => {
    try{
      const user_id = req.params.id;
      const { data, error } = await supabase.from('users').select('*').eq('user_id', user_id).single();;
      if (error) return res.status(400).json({ message: "Error fetching users", error, data: data});

      return res.status(200).json(data);
    }catch(e){
      console.error(e);
      return res.status(500).json({ message: "Internal server error" });
    }
})

// Update User

// Delete User
adminRouter.delete('/deleteuser', async (req, res) => {
  try{
    const { user_id } = req.body;
    
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('user_id', user_id);
    
    if (error) {
      return res.status(400).json({ message: "Error deleting user", error, data: data });
    }
    //console.log('Deleting user_id:', req.body.user_id);
    return res.status(200).json({ message: "User deleted!" });
  }catch(e){
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

// Newsletter
adminRouter.post('/newsletter', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const response = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email_address: email }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Buttondown error:", errorText);
      return res.status(500).json({ error: "Subscription failed", detail: errorText });
    }

    return res.status(200).json({ message: "Subscribed successfully!" });
  } catch (err) {
    console.error("Subscription error:", err);
    return res.status(500).json({ error: "Subscription failed" });
  }
});


// -------------------------------------- AUCTIONS -------------------------------------------------

// Get All Auctions
adminRouter.get('/auctions', async (req, res) => {
    try{
      const { data, error } = await supabase.from('auctions').select('*').order('created_at', { ascending: false });
      if(error) return res.status(400).json({ message: "Error fetching auctions", error, data: data});

      return res.status(200).json(data);

    }catch(e){
      console.error(e);
      return res.status(500).json({ message: "Internal server error" });
    }
})

// Get Auction by ID
adminRouter.get('/auctions/:id', async (req, res) => {
  try{
    const auction_id = req.params.id;
    const { data, error } = await supabase.from('auctions').select('*').eq('auction_id', auction_id).single();
    if(error) return res.status(400).json({ message: "Error fetching auction", error, data: data});

    return res.status(200).json(data);

  }catch(e){
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
})

// Delete Auction


// -------------------------------------- BIDS -------------------------------------------------

// Get All Bids
adminRouter.get('/bids', async (req, res) => {
  try{
    const { data, error } = await supabase.from('bids').select('*').order('created_at', { ascending: false });
    if(error) return res.status(400).json({ message: "Error fetching bids", error, data: data});

    return res.status(200).json(data);

  }catch(e){
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
})

// Get Bid by ID
adminRouter.get('/bids/:id', async (req, res) => {
  try{
    const bid_id = req.params.id;
    const { data, error } = await supabase.from('bids').select('*').eq('bid_id', bid_id).single();
    if(error) return res.status(400).json({ message: "Error fetching bid", error, data: data});

    return res.status(200).json(data);
  }catch(e){
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
})


export default adminRouter;