import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import productRouter from './routers/product.js';
import authRouter from './routers/auth.js';
import reviewRouter from './routers/review.js';
import orderRouter from './routers/order.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth',     authRouter);
app.use('/api/products', productRouter);
app.use('/api/reviews',  reviewRouter);
app.use('/api/orders',   orderRouter);

app.get('/', (req, res) => res.json({ message: 'EndurACE API is running' }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));