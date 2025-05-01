import express from 'express'
import supabase from '../../config/supabaseClient.js';


const authRouter = express.Router();

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