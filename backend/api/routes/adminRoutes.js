import supabase from '../../config/supabaseClient.js';
import express from 'express'
import dotenv from 'dotenv'


dotenv.config();
//console.log("BUTTONDOWN_API_KEY:", process.env.BUTTONDOWN_API_KEY);
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


// -------------------------------------- MISC -------------------------------------------------


// Newsletter
adminRouter.post('/newsletter', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const response = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token 90bf6252-fe17-4259-9d27-fd0dcf82496d`,
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

// DialogFlow webhook
adminRouter.post('/webhook', async (req, res) => {

  const intent = req.body.queryResult.intent.displayName;
  const auctionName = req.body.queryResult.parameters["auction_name"];

  try{
    
    if (!auctionName) {
      return res.json({ fulfillmentText: "Which auction are you interested in?" });
    }

    const { data: auction, error } = await supabase
    .from("auctions")
    .select("auction_id, auction_type, highest_bid")
    .ilike("item_name", `%${auctionName}%`)
    .maybeSingle();

    if (!auction) {
      return res.json({ fulfillmentText: `Couldn't find any auction named "${auctionName}".` });
    }


    const { auction_id, auction_type, highest_bid } = auction;

    if (intent === "SmartBidSuggestion") {
      if (auction_type === "reverse") {
        const { data: bids } = await supabase
          .from("bids")
          .select("bid_amount")
          .eq("auction_id", auction_id);

        const freq = {};
        bids.forEach(b => {
          const amt = parseFloat(b.bid_amount);
          freq[amt] = (freq[amt] || 0) + 1;
        });

        const unique = Object.entries(freq)
          .filter(([_, count]) => count === 1)
          .map(([amt]) => parseFloat(amt));

        const suggested = Math.min(...unique);

        return res.json({
          fulfillmentText: isFinite(suggested)
            ? `Try a unique bid like $${suggested.toFixed(2)}. That could win!`
            : "No unique bids yet. Try a small unusual number!",
        });
      }

      if (auction_type === "blitz") {
        const suggested = (highest_bid + Math.floor(Math.random() * 10 + 5)).toFixed(2);
        return res.json({
          fulfillmentText: `Try bidding $${suggested} — fast and slightly higher than the current bid!`,
        });
      }

      return res.json({
        fulfillmentText: `Current highest bid is $${highest_bid}. Try bidding slightly more to win.`,
      });
    }

    if (intent === "TopBidders") {
      const { data: bids } = await supabase
        .from("bids")
        .select("user_name, bid_amount")
        .eq("auction_id", auction_id)
        .order("bid_amount", { ascending: false })
        .limit(3);

      const message = bids.length
        ? bids.map((b, i) => `${i + 1}. ${b.user_name} - $${b.bid_amount}`).join("\n")
        : "No bids yet on this auction.";

      return res.json({ fulfillmentText: message });
    }

    res.json({ fulfillmentText: "I'm still learning how to help with that!" });

  }catch(e){
    console.error("Webhook error:", e);
    return res.json({ fulfillmentText: "Sorry, something went wrong on my side." });
  }
})

// Chatbot
adminRouter.post('/chatbot', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post("https://asyncawait-auction-project.onrender.com/api/admin/webhook", {
      queryResult: {
        queryText: userMessage,
        intent: { displayName: "" },
        parameters: {},
      },
    });

    const fulfillmentText = response.data.fulfillmentText || "Sorry, I don't have an answer.";

    return res.json({ reply: fulfillmentText });
  } catch (error) {
    console.error("Chatbot error:", error);
    return res.json({ reply: "Oops! Something went wrong." });
  }
});


export default adminRouter;