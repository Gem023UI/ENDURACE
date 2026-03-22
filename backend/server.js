import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRouter     from './routers/auth.js';
import productRouter  from './routers/product.js';
import reviewRouter   from './routers/review.js';
import orderRouter    from './routers/order.js';
import discountRouter from './routers/discount.js';
import promoRouter    from './routers/promo.js';
import articleRouter  from './routers/article.js';
import userRouter     from './routers/user.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin',      req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods',     'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers',     'Origin,X-Requested-With,Content-Type,Accept,Authorization');
  res.header('Access-Control-Max-Age',           '86400');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth',      authRouter);
app.use('/api/products',  productRouter);
app.use('/api/reviews',   reviewRouter);
app.use('/api/orders',    orderRouter);
app.use('/api/discounts', discountRouter);
app.use('/api/promo',     promoRouter);
app.use('/api/articles',  articleRouter);
app.use('/api/users',     userRouter);

app.get('/', (req, res) => res.json({ message: 'EndurACE API is running' }));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', method: req.method, path: req.originalUrl });
});

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));