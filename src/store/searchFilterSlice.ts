import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchFilterState } from '../types/movie';

const initialState: SearchFilterState = {
  searchTerm: 'Pokemon', // Default value
  year: '',
  type: '',
  page: 1,
};

const searchFilterSlice = createSlice({
  name: 'searchFilter',
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setYear(state, action: PayloadAction<string>) {
      state.year = action.payload;
    },
    setType(state, action: PayloadAction<string>) {
      state.type = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    resetFilters(state) {
      state.searchTerm = '';
      state.year = '';
      state.type = '';
      state.page = 1;
    },
  },
});

export const { setSearchTerm, setYear, setType, setPage, resetFilters } = searchFilterSlice.actions;

export default searchFilterSlice.reducer;
