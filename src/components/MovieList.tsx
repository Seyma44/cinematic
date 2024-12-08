import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Typography
} from '@mui/material';
import { fetchMovies } from '../store/movieSlice';
import { RootState, AppDispatch } from '../store';
import { MovieListProps } from '../types/movie';
import defaultImageUrl from '../assets/default-image.png';

const MovieList: React.FC<MovieListProps> = ({ 
  searchTerm, 
  year, 
  type, 
  page, 
  
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showError, setShowError] = useState(false);
  const { movies, loading, error } = useSelector((state: RootState) => state.movies);
  const location = useLocation();

  const searchMovies = useCallback(() => {
    if (searchTerm.trim()) {
      dispatch(fetchMovies({ searchTerm, year, type, page }));
    }
  }, [dispatch, searchTerm, year, type, page]);

  useEffect(() => {
    searchMovies();
  }, [searchMovies]);

  useEffect(() => {
    if (error) {
      // Delay error message display by 1.5 seconds
      const timer = setTimeout(() => setShowError(true), 1500);
      return () => clearTimeout(timer); // Cleanup the timer on unmount
    }
  }, [error]);

  if (loading) return <Typography className="loading-text">Loading...</Typography>;
  if (!searchTerm.trim()) {
    return <Typography className="error-text">Oops! You forgot to type something. What movie are you looking for? 🤔</Typography>;
  }
  if (showError && error) {
    return <Typography className="error-text">No movies found. Your search might be too *avant-garde*. Try a more common search term!</Typography>;
  }
  return (
    <div className="body-main">
      <TableContainer component={Paper} className="movie-table">
        <Table stickyHeader aria-label="movie list">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Release Date</TableCell>
              <TableCell>IMDb ID</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie.imdbID} hover>
                <TableCell>
                  <img
                    src={movie.Poster !== 'N/A' ? movie.Poster : defaultImageUrl}
                    alt={`${movie.Title} poster`}
                    className="movie-poster"
                  />
                </TableCell>
                <TableCell>
                  <Link 
                    to={`/movie/${movie.imdbID}`} 
                    state={{ from: location.pathname + location.search }} 
                    className="movie-title"
                  >
                    {movie.Title}
                  </Link>
                </TableCell>
                <TableCell>{movie.Year}</TableCell>
                <TableCell>{movie.imdbID}</TableCell>
                <TableCell>{movie.Type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MovieList;

