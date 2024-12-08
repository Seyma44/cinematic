import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination } from '@mui/material';
import { fetchMovies } from '../store/movieSlice';
import { RootState, AppDispatch } from '../store';

const MovieList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, totalResults, loading, error } = useSelector((state: RootState) => state.movies);
  const [page, setPage] = useState(0);  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(10);  // Rows per page
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  // Extract query parameters from URL
  const searchTerm = searchParams.get('q') || '';
  const year = searchParams.get('year') || '';
  const type = searchParams.get('type') || 'all'; // Default to 'all'
  const currentPage = parseInt(searchParams.get('page') || '1', 10) - 1;

  useEffect(() => {
    setPage(currentPage);
  }, [searchTerm, year, type, currentPage]);  // Reset page when filters change

  const searchMovies = useCallback(() => {
    dispatch(fetchMovies({ searchTerm, year, type, page: page + 1 }));
  }, [dispatch, searchTerm, year, type, page]);

  useEffect(() => {
    searchMovies();
  }, [searchMovies, location.search, page]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('page', (newPage + 1).toString()); // Update page number
    navigate(`/?${queryParams.toString()}`, { replace: true });
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);  // Reset to first page when rows per page changes
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('page', '1'); // Reset to first page
    queryParams.set('rowsPerPage', newRowsPerPage.toString());
    navigate(`/?${queryParams.toString()}`, { replace: true });
  };

  return (
    <div className="body-main">
      {loading && <Typography className="loading-text">Loading...</Typography>}
      {error && <Typography className="error-text">Error: {error}</Typography>}

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
                    src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.svg'}
                    alt={`${movie.Title} poster`}
                    className="movie-poster"
                  />
                </TableCell>
                <TableCell>
                  <Link to={`/movie/${movie.imdbID}`}  state={{ from: location.pathname + location.search }} className="movie-title">
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

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalResults}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default MovieList;
