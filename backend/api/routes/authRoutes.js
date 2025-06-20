import express from 'express'
import supabase from '../../config/supabaseClient.js';
import { type } from 'os';


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
  
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData?.user) {
      console.error("Supabase auth error:", authError?.message);
      return res.status(401).json({ message: "User not authenticated" });
    }
  
    const { data: userDatabaseData, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();
  
    if (dbError || !userDatabaseData) {
      console.error("Supabase DB error:", dbError?.message);
      return res.status(404).json({ message: "User data not found" });
    }
  
    console.log(userDatabaseData);
    return res.status(200).json(userDatabaseData);
});


// Get User's DB Data w/ user_id
authRouter.post('/fetchuser', async (req, res) => {
    const { user_id } = req.body;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq("user_id", user_id)
        .single(); // <-- fix: call the function

    if (error) return res.status(400).json({ message: "DB error", error });

    //console.log(data);
    return res.json(data);
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
        if(signupErr) return res.status(400).json({message: signupErr.message})


        const { error: profileErr } = await supabase.from('users').insert([{
            user_id: signupData.user.id,
            name,
            username,
            email,
        }]);
        if(profileErr) return res.status(400).json({message: profileErr.message})


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
        if (error || !data || !data.session) return res.status(401).json({ message: error?.message || 'Invalid login credentials.' });

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
      return res.status(400).json({ message: insertError.message });
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
      return res.status(400).json({ message: "Insufficient funds" });
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
      return res.status(400).json({ message: insertError.message });
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


export default authRouter;