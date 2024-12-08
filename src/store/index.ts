import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './movieSlice';
import searchFilterReducer from './searchFilterSlice'

export const store = configureStore({
  reducer: {
    movies: movieReducer,
    searchFilter: searchFilterReducer, // Add this line
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

