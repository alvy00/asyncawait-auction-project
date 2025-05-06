import express from 'express'
import cors from 'cors'
import morgan from 'morgan';
import dotenv from 'dotenv'
import auctionRoutes from './api/routes/auctionRoutes.js'
import authRoutes from './api/routes/authRoutes.js'
import cookieParser from 'cookie-parser'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

//Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use('/api/auctions', auctionRoutes);
app.use('/api', authRoutes);

//Routes

app.get('/', (req, res) => {
    res.send('Hello world');
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})

export default app;