import supabase from '../../config/supabaseClient.js';
import express from 'express'


const adminRouter = express.Router();


// Get All Users
adminRouter.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      return res.status(400).json({ message: "Error occurred", error });
    }

    return res.status(200).json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error", error: e });
  }
});


export default adminRouter;