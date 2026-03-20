import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import reviewReducer from './reviewSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    products: productReducer,
    reviews: reviewReducer,
    cart: cartReducer,
    // orderSlice will be added in Term Test
  },
});

export default store;