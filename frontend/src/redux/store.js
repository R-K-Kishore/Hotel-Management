// Redux store setup
// Combines all slices into a single store

import { configureStore } from '@reduxjs/toolkit';
import hotelReducer from './hotelSlice';

const store = configureStore({
  reducer: {
    hotels: hotelReducer,
  },
});

export default store;

