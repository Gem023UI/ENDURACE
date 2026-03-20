import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import reviewReducer from './reviewSlice';
// orderSlice will be added in Term Test (MP order)

const store = configureStore({
  reducer: {
    products: productReducer,
    reviews: reviewReducer,
  },
});

export default store;