import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import reviewReducer  from './reviewSlice';
import cartReducer    from './cartSlice';
import orderReducer   from './orderSlice';

const store = configureStore({
  reducer: {
    products: productReducer,
    reviews:  reviewReducer,
    cart:     cartReducer,
    orders:   orderReducer,
  },
});

export default store;