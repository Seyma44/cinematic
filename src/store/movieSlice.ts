
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Movie, MovieDetails, MovieState } from '../types/movie';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

if (!API_KEY || !API_URL) {
  throw new Error('API_KEY or API_URL is not defined in .env');
}

const initialState: MovieState = {
  movies: [],
  selectedMovie: null,
  totalResults: 0,
  loading: false,
  error: null,
};

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ searchTerm, year, type, page }: { searchTerm: string; year: string; type: string; page: number }, { rejectWithValue }) => {
    try {
      const yearParam = year ? `&y=${year}` : '';
      const typeParam = type && type !== 'all' ? `&type=${type}` : '';

      const response = await axios.get(`${API_URL}?apikey=${API_KEY}&s=${searchTerm}${yearParam}${typeParam}&page=${page}`);

      if (response.data.Response === "False") {
        return rejectWithValue(response.data.Error);
      }

      const totalResults = parseInt(response.data.totalResults, 10) || 0;

      if (!response.data.Search || response.data.Search.length === 0) {
        return rejectWithValue('No movies found for your query');
      }

      return {
        Search: response.data.Search,
        totalResults
      };
    } catch (error) {
      console.error('Fetch movies error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}?apikey=${API_KEY}&i=${id}`);
      if (response.data.Response === "False") {
        return rejectWithValue(response.data.Error);
      }
      return response.data;
    } catch (error) {
      console.error('Fetch movie details error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<{ Search: Movie[]; totalResults: number }>) => {
        state.loading = false;
        state.movies = action.payload.Search || [];
        state.totalResults = action.payload.totalResults;
        state.error = null;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.movies = [];
        state.totalResults = 0;
        state.error = action.error.message || 'An error occurred';
      })
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action: PayloadAction<MovieDetails>) => {
        state.loading = false;
        state.selectedMovie = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export default movieSlice.reducer;

