import { configureStore } from '@reduxjs/toolkit';
import productReducer  from './productSlice';
import reviewReducer   from './reviewSlice';
import cartReducer     from './cartSlice';
import orderReducer    from './orderSlice';
import discountReducer from './discountSlice';

const store = configureStore({
  reducer: {
    products:  productReducer,
    reviews:   reviewReducer,
    cart:      cartReducer,
    orders:    orderReducer,
    discounts: discountReducer,
  },
});

export default store;