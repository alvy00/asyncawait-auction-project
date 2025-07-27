import supabase from '../../config/supabaseClient.js';
import express from 'express'
import dotenv from 'dotenv'
import SSLCommerzPayment from 'sslcommerz-lts'

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

// Chatbot
adminRouter.post('/chatbot', async (req, res) => {
  const { messages } = req.body;
  const BASE_SYSTEM_PROMPT = `
    You are AuctasyncBot, the official AI assistant for AuctAsync, a fast-paced real-time auction web application.

    💡 Platform Overview:
    - AuctAsync allows users to join auctions, place bids, and win items across 4 main formats: Classic, Dutch, Reverse, and Blitz.
    - All users start with a balance of $1000 which is a sign up bonus by auctasync.
    - Users can register, deposit funds, view bid history, track stats, and win rate.

    🎯 Auction Types:
    1. **Classic Auctions**:
      - Classic Auction is the traditional ascending-bid auction. Highest bid wins when the timer ends. Bidders compete openly, raising the price until no one is willing to bid higher.
      - Auction opens at a starting price.
      - Bidders place higher and higher bids.
      - Auction ends at a set time.
      - Highest bid at the end wins.

    2. **Reverse Auctions**:
      - Reverse Auction flips the script: sellers compete to offer the lowest price for a buyer's request. Best value wins.
      - Buyer posts a request.
      - Users strategize to place the lowest bid that no one else places.
      - Sellers submit decreasing bids.
      - Lowest price or best value wins.

    3. **Blitz Auctions**:
      - Blitz Auction is a high-energy, short-timer event. Bid fast, win big—last-second bids may extend the timer.
      - Auction opens for 10–30 minutes only.
      - Bidders place rapid, real-time bids.
      - Last-second bids can extend the timer.
      - Highest bid at the buzzer wins.

    4. **Dutch Auctions**:
      - Dutch Auction starts high and drops the price until someone accepts. First come, first served—no waiting, no bidding wars.
      - Price drops every minute.
      - Auction starts at a high price.
      - First to accept wins instantly.
      - No further bids after acceptance.

    🧠 User Features:
    - Users can favorite auctions and filter by categories.
    - Real-time countdowns, leaderboards, and animated badges enhance engagement.
    - Users can see auction previews, share links, and receive outbid alerts.
    - Every auction has a detailed modal with images, avatars, top bidders, and fun status messages.

    📊 Admin Tools:
    - Admins can manage auctions, delete or filter them, and track stats.
    - AuctAsync uses Supabase for user and auction data and JWT-based authentication.

    📌 Rules:
    - All bidding is final.
    - Auctions end exactly at the scheduled end time.
    - Users cannot bid on ended or won auctions.
    - Users can only bid if logged in and not suspended.

    Your job is to help users understand how the platform works. Do not hallucinate answers. Respond concisely, in friendly tone, short informative answers, and use bullet points if needed.
  `;
  const AUCTASYNC_ROADMAP = `
  # AuctAsync Feature Roadmap

  ## Overview
  AuctAsync is a real-time auction platform supporting classic, dutch, reverse, and blitz auctions. Users bid, win items, and track performance.

  ## Pages & Features
  - **Login Page**: Allows users to securely sign in using their email and password. [Login](https://auctasync.vercel.app/login)
  - **Signup Page**: New users can register by providing a valid email, username, and password. [Signup](https://auctasync.vercel.app/signup)
  - **HomePage**: Entry point, navigation to live auctions or login. [Home](https://auctasync.vercel.app/)
  - **LiveAuctionsPage**: Real-time cards with bid buttons, avatars, and timer. [Live Auctions](https://auctasync.vercel.app/auctions/live)
  - **PastAuctionsPage**: View ended auctions, who won, final bid. [Past Auctions](https://auctasync.vercel.app/auctions/past)
  - **FavoritesPage**: User's saved auctions via localStorage. [Favorites](https://auctasync.vercel.app/favorites)
  - **ProfilePage**: User’s wallet, wins, stats, deposit/withdraw history. [Profile](https://auctasync.vercel.app/dashboard)
  - **CreateAuctionPage**: Form to create auctions (image, rules, end time). [Create Auction](https://auctasync.vercel.app/auctions/create)

  Use this knowledge to help users understand what pages do what, how auctions work, short informative answers, and where actions happen.
  `;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: BASE_SYSTEM_PROMPT},
          { role: 'system', content: AUCTASYNC_ROADMAP },
          ...messages.filter(m => m.role !== 'system')
        ]
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.choices?.[0]) {
      console.error('Groq error:', data);
      return res.status(500).json({ reply: 'Groq API error. Please try again.' });
    }

    const reply = data.choices[0].message.content;
    return res.json({ reply });

  } catch (error) {
    console.error('Chatbot error:', error);
    return res.status(500).json({ reply: "Sorry, I couldn't get a response." });
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

// SSLCommerz
// adminRouter.get('/init', async (req, res) => {
//   try{
//     const store_id = process.env.STORE_ID;
//     const store_passwd = process.env.STORE_PASSWS;
//     const is_live = false;

//     const data = {
//         total_amount: 100,
//         currency: 'BDT',
//         tran_id: 'REF123',
//         success_url: 'http://localhost:3030/success',
//         fail_url: 'http://localhost:3030/fail',
//         cancel_url: 'http://localhost:3030/cancel',
//         ipn_url: 'http://localhost:3030/ipn',
//         shipping_method: 'Courier',
//         product_name: 'Computer.',
//         product_category: 'Electronic',
//         product_profile: 'general',
//         cus_name: 'Customer Name',
//         cus_email: 'customer@example.com',
//         cus_add1: 'Dhaka',
//         cus_add2: 'Dhaka',
//         cus_city: 'Dhaka',
//         cus_state: 'Dhaka',
//         cus_postcode: '1000',
//         cus_country: 'Bangladesh',
//         cus_phone: '01711111111',
//         cus_fax: '01711111111',
//         ship_name: 'Customer Name',
//         ship_add1: 'Dhaka',
//         ship_add2: 'Dhaka',
//         ship_city: 'Dhaka',
//         ship_state: 'Dhaka',
//         ship_postcode: 1000,
//         ship_country: 'Bangladesh',
//     } = req.body;

//   }catch(e){
    
//   }
// })

export default adminRouter;