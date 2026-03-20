import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';

const store = configureStore({
  reducer: {
    products: productReducer,
    // orderSlice and reviewSlice will be added in their respective MPs
  },
});

export default store;