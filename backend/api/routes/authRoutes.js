import express from 'express'
import supabase from '../../config/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

const REDIRECT_TO = "https://auctasync.vercel.app/auth/callback";
const authRouter = express.Router();

// Server Ping
authRouter.get('/ping', (req, res) => {
  return res.status(200).json({ message: "Server is active" });
});

// Get Current Logged IN User's Database Data
authRouter.get('/getuser', async (req, res) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid Authorization header" });
    }
  
    const token = authHeader.split(" ")[1];
    
    try{
      const { data: authData, error: authError } = await supabase.auth.getUser(token);
      if (authError || !authData?.user) {
        console.error("Supabase auth error:", authError?.message);
        return res.status(401).json({ message: "User not authenticated", data: authData });
      }
    
      const { data: userDatabaseData, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();
    
      if (dbError || !userDatabaseData) {
        console.error("Supabase DB error:", dbError?.message);
        return res.status(404).json({ message: "User data not found", data: userDatabaseData });
      }
    
      //console.log(userDatabaseData);
      return res.status(200).json(userDatabaseData);
      
    }catch(e){
      console.error(e);
    }
    
});

// Get User's DB Data w/ user_id
authRouter.post('/fetchuser', async (req, res) => {
    const { user_id } = req.body;

    try{
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq("user_id", user_id)
        .single();

      if (error) return res.status(400).json({ message: "DB error", error, data: data });

      //console.log(data);
      return res.json(data);
    }catch(e){
      console.error(e);
    }
    
});

// User SignUP
authRouter.post('/signup', async (req, res) => {
    const { name, username, email, password } = req.body;
    if(!name || !username || !email || !password) return res.status(400).json({message: 'All fields are required!'})
    
    const isValidEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };


    try{
        
        const {data: existingEmail } = await supabase.from('users').select('*').eq('email', email);
        const {data: existingUsername } = await supabase.from('users').select('*').eq('username', username);

        if (!isValidEmail(email)) return res.status(400).json({ message: 'Email address is invalid' });
        if(existingEmail.length > 0) return res.status(400).json({message: 'Email already in use!'})
        if(existingUsername.length > 0) return res.status(400).json({message: 'Username already taken!'})

        const { data: signupData, error: signupErr } = await supabase.auth.signUp({
            email, 
            password
        })
        if(signupErr) return res.status(400).json({message: signupErr.message, data: signupData})


        const { error: profileErr } = await supabase.from('users').insert([{
            user_id: signupData.user.id,
            name,
            username,
            email,
        }]);
        if(profileErr) return res.status(400).json({message: profileErr.message, data: profileErr})


        res.status(201).json({message: 'User created successfully!'});
        
    }catch(e){
        console.log('Signup error:', e);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// User Login
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({message: "All fields required!"})

    try{
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error || !data || !data.session) return res.status(401).json({ message: error?.message || 'Invalid login credentials.', data: data });

        return res.status(200).json({
            message: 'Login successful!',
            token: data.session.access_token,
            user: data.user,
        });

    }catch(e){
        console.error('Login error:', e);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// User Name Update
authRouter.post('/nameupdate', async (req, res) => {
  const { user_id, name } = req.body;

  if (!user_id || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ message: "Invalid user_id or name" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .update({ name })
      .eq("user_id", user_id);

    if (error) {
      return res.status(400).json({ message: "Error updating name", error, data: data });
    }

    return res.status(200).json({ message: "Name updated successfully", data });
  } catch (e) {
    console.error("Unexpected error in /nameupdate:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

// User Email Update
authRouter.post('/emailupdate', async (req, res) => {
  const { user_id, email } = req.body;

  if (!user_id || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid user_id or email" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .update({ email })
      .eq("user_id", user_id);

    if (error) {
      return res.status(400).json({ message: "Error updating email", error, data: data });
    }

    return res.status(200).json({ message: "Email updated successfully", data });
  } catch (e) {
    console.error("Unexpected error in /emailupdate:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

// User Bio Update
authRouter.post('/bioupdate', async (req, res) => {
  const { user_id, bio } = req.body;

  if (!user_id || typeof bio !== "string") {
    return res.status(400).json({ message: "Missing or invalid user_id or bio text" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .update({ bio })
      .eq("user_id", user_id);

    if (error) {
      console.error("Failed to update bio:", error.message);
      return res.status(500).json({ message: "Failed to update bio", error: error.message, data: data });
    }

    return res.status(200).json({ message: "Bio updated successfully", data });
  } catch (e) {
    console.error("Unexpected error in /bioupdate:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

// User Deposit
authRouter.post('/deposit', async (req, res) => {
  const { user_id, amount } = req.body;

  if (!user_id || !amount) {
    return res.status(400).json({ message: "All fields required!" });
  }

  try {
    const { data: transactionData, error: insertError } = await supabase
      .from('transactions')
      .insert([{ user_id, type: "deposit", amount }])
      .select();

    if (insertError) {
      return res.status(400).json({ message: insertError.message, data: transactionData });
    }

    const { error: rpcError } = await supabase.rpc('increment_user_total_deposits', {
      user_id,
      deposit_amount: amount
    });

    if (rpcError) {
      return res.status(400).json({ message: rpcError.message });
    }

    return res.status(200).json({ message: "Deposit successful", transaction: transactionData[0] });

  } catch (e) {
    console.error('Deposit Error:', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// User Withdrawal
authRouter.post('/withdraw', async (req, res) => {
  const { user_id, amount } = req.body;

  if (!user_id || !amount) {
    return res.status(400).json({ message: "All fields required!" });
  }

  const withdrawalAmount = Number(amount);
  if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
    return res.status(400).json({ message: "Invalid withdrawal amount" });
  }

  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('money')
      .eq('user_id', user_id)
      .single();

    if (userError) {
      return res.status(400).json({ message: userError.message });
    }
    if (!userData || userData.money < withdrawalAmount) {
      return res.status(400).json({ message: "Insufficient funds", data: userData });
    }

    const { data: transactionData, error: insertError } = await supabase
      .from('transactions')
      .insert([{ user_id, type: 'withdrawal', amount: -withdrawalAmount }])
      .select();

    if (insertError) {
      return res.status(400).json({ message: insertError.message });
    }

    const { error: rpcError } = await supabase.rpc('increment_user_total_withdrawals', {
      user_id,
      withdrawal_amount: withdrawalAmount,
    });

    if (rpcError) {
      return res.status(400).json({ message: rpcError.message });
    }

    const { error: updateMoneyError } = await supabase
      .from('users')
      .update({ money: userData.money - withdrawalAmount })
      .eq('user_id', user_id);

    if (updateMoneyError) {
      return res.status(400).json({ message: updateMoneyError.message });
    }

    return res.status(200).json({ message: "Withdrawal successful", transaction: transactionData[0] });

  } catch (e) {
    console.error('Withdrawal Error:', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// User spent_on_bids (Win)
authRouter.post('/record-win', async (req, res) => {
  const { user_id, amount } = req.body;

  if (!user_id || !amount) {
    return res.status(400).json({ message: "All fields required!" });
  }

  const winAmount = Number(amount);
  if (isNaN(winAmount) || winAmount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    const { data: transactionData, error: insertError } = await supabase
      .from('transactions')
      .insert([{ user_id, type: 'win', amount: -winAmount }])
      .select();

    if (insertError) {
      return res.status(400).json({ message: insertError.message, data: transactionData });
    }

    const { error: rpcError } = await supabase.rpc('increment_user_spent_on_bids', {
      user_id,
      spent_amount: winAmount,
    });

    if (rpcError) {
      return res.status(400).json({ message: rpcError.message });
    }

    return res.status(200).json({ message: "Win recorded successfully", transaction: transactionData[0] });

  } catch (e) {
    console.error('Win Error:', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Social logins
authRouter.get('/login/:provider', async (req, res) => {
  const { provider } = req.params;
  const state = uuidv4();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: REDIRECT_TO,
      scopes: 'email',
      queryParams: { state },
    },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.redirect(data.url);
});

// OAuth Callback
authRouter.post('/oauth/callback', async (req, res) => {
  const { access_token, refresh_token } = req.body;

  if (!access_token || !refresh_token) {
    return res.status(400).json({ message: 'Missing tokens' });
  }

  try {
    await supabase.auth.setSession({ access_token, refresh_token });

    const { data: user, error } = await supabase.auth.getUser();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid tokens', error });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

export default authRouter;