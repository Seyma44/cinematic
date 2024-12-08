import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = '61ecc1e7'; 
const API_URL = 'http://www.omdbapi.com/';

interface Movie {
  type: string;
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface MovieDetails extends Movie {
  Runtime: string;
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  imdbRating: string;
}

interface MovieState {
  movies: Movie[];
  selectedMovie: MovieDetails | null;
  totalResults: number;
  loading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  movies: [],
  selectedMovie: null,
  totalResults: 0,
  loading: false,
  error: null,
};

// Fetch movies from API with search term, year, type, and page
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ searchTerm, year, type, page }: { searchTerm: string; year: string; type: string; page: number }) => {
    const yearParam = year ? `&y=${year}` : '';
    const typeParam = type && type !== 'all' ? `&type=${type}` : ''; // Exclude type if 'all'

    const response = await axios.get(`${API_URL}?apikey=${API_KEY}&s=${searchTerm}${yearParam}${typeParam}&page=${page}`);

    if (response.data.Response === "False") {
      throw new Error(response.data.Error);
    }

    const totalResults = parseInt(response.data.totalResults, 10) || 0;

    if (!response.data.Search || response.data.Search.length === 0) {
      throw new Error('No movies found for your query');
    }

    return {
      Search: response.data.Search,
      totalResults
    };
  }
);



// Fetch details for a single movie by IMDb ID
export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async (id: string) => {
    const response = await axios.get(`${API_URL}?apikey=${API_KEY}&i=${id}`);
    if (response.data.Response === "False") {
      throw new Error(response.data.Error);
    }
    return response.data;
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle pending state for fetchMovies
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state for fetchMovies
      .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<{ Search: Movie[]; totalResults: number }>) => {
        state.loading = false;
        state.movies = action.payload.Search || [];
        state.totalResults = action.payload.totalResults;
        state.error = null;
      })
      // Handle rejected state for fetchMovies
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.movies = [];
        state.totalResults = 0;
        state.error = action.error.message || 'An error occurred';
      })
      // Handle pending state for fetchMovieDetails
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state for fetchMovieDetails
      .addCase(fetchMovieDetails.fulfilled, (state, action: PayloadAction<MovieDetails>) => {
        state.loading = false;
        state.selectedMovie = action.payload;
      })
      // Handle rejected state for fetchMovieDetails
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export default movieSlice.reducer;
