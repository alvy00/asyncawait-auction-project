import express from 'express'
import supabase from '../../config/supabaseClient.js';


const authRouter = express.Router();

//Get Current Logged IN User's Database Data
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


//User SignUP
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


//User Login
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

export default authRouter;