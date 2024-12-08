import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = '61ecc1e7'; 
const API_URL = 'http://www.omdbapi.com/';

// Movie interface for search results
interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

// Detailed movie interface for movie details
interface MovieDetails extends Movie {
  Runtime: string;
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  imdbRating: string;
}

// Movie state interface
interface MovieState {
  movies: Movie[];
  selectedMovie: MovieDetails | null;
  totalResults: number;
  loading: boolean;
  error: string | null;
  lastSearchParams: { searchTerm: string, year: string, type: string, page: number };
}

// Initial state of the movie slice
const initialState: MovieState = {
  movies: [],
  selectedMovie: null,
  totalResults: 0,
  loading: false,
  error: null,
  lastSearchParams: { searchTerm: '', year: '', type: '', page: 0 },
};

// Fetch movies async thunk
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (params: { searchTerm: string, year: string, type: string, page: number }) => {
    const { searchTerm, year, type, page } = params;
    const { data } = await axios.get(API_URL, {
      params: {
        s: searchTerm,
        y: year,
        type,
        page,
        apikey: API_KEY,
      },
    });
    return data as { Search: Movie[], totalResults: string }; // Type the response
  }
);

// Fetch movie details async thunk
export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async (id: string) => {
    const { data } = await axios.get(API_URL, {
      params: {
        i: id,
        apikey: API_KEY,
      },
    });
    return data as MovieDetails; // Type the response
  }
);

// Movie slice with reducers and extra reducers
const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setLastSearchParams(state, action: PayloadAction<{ searchTerm: string, year: string, type: string, page: number }>) {
      state.lastSearchParams = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<{ Search: Movie[], totalResults: string }>) => {
        state.loading = false;
        state.movies = action.payload.Search || [];
        state.totalResults = parseInt(action.payload.totalResults, 10) || 0;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action: PayloadAction<MovieDetails>) => {
        state.selectedMovie = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch movie details';
      });
  },
});

// Export actions
export const { setLastSearchParams } = movieSlice.actions;

// Export the reducer
export default movieSlice.reducer;
