import React, { useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { SelectChangeEvent } from '@mui/material';
import SearchFilter from '../components/SearchFilter';
import MovieList from '../components/MovieList';
import { TablePagination } from '@mui/material';
import { RootState, AppDispatch } from '../store';
import { fetchMovies } from '../store/movieSlice';
import debounce from 'lodash/debounce';
import {
  setSearchTerm,
  setYear,
  setType,
  setPage,
} from '../store/searchFilterSlice';
import '../styles/BodyMain.scss';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const { searchTerm, year, type, page } = useSelector(
    (state: RootState) => state.searchFilter
  );
  const { totalResults, loading } = useSelector((state: RootState) => state.movies);

  const rowsPerPage = 10;

  const updateUrlParams = useCallback(() => {
    const queryParams = new URLSearchParams();
    if (searchTerm.trim()) queryParams.set('q', searchTerm); // Only include if searchTerm is not empty
    if (year) queryParams.set('year', year);
    if (type) queryParams.set('type', type);
    queryParams.set('page', page.toString());

    navigate(`/?${queryParams.toString()}`, { replace: true });
  }, [searchTerm, year, type, page, navigate]);

  // Debounced search function
  const debouncedSearchRef = useRef(
    debounce((term: string, year: string, type: string, page: number) => {
      // Trim here before calling the search action
      const trimmedTerm = term.trim();
      if (trimmedTerm) {
        dispatch(fetchMovies({ searchTerm: trimmedTerm, year, type, page }));
      }
    }, 500) // Debounce delay
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newSearchTerm = searchParams.get('q') || searchTerm;
    const newYear = searchParams.get('year') || '';
    const newType = searchParams.get('type') || '';
    const newPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

    dispatch(setSearchTerm(newSearchTerm));
    dispatch(setYear(newYear));
    dispatch(setType(newType));
    dispatch(setPage(newPage));

    if (newSearchTerm.trim()) {
      debouncedSearchRef.current(newSearchTerm, newYear, newType, newPage);
    }
  }, [location.search, dispatch]);

  useEffect(() => {
    updateUrlParams(); // Update the URL whenever searchTerm, year, type, or page changes
  }, [searchTerm, year, type, page, updateUrlParams]);

  // Event handlers for user interactions
  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = event.target.value;
    dispatch(setYear(newYear));
    dispatch(setPage(1));
    debouncedSearchRef.current(searchTerm, newYear, type, 1);
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const newType = event.target.value;
    dispatch(setType(newType));
    dispatch(setPage(1));
    debouncedSearchRef.current(searchTerm, year, newType, 1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value; // Don't trim here
    dispatch(setSearchTerm(newSearchTerm)); // Update the search term with the input value
    dispatch(setPage(1)); // Reset to the first page when the search term changes
    debouncedSearchRef.current(newSearchTerm, year, type, 1); // Call debounced function
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    const nextPage = newPage + 1;
    dispatch(setPage(nextPage));
    debouncedSearchRef.current(searchTerm, year, type, nextPage);
  };
  const isSearchCleared = !searchTerm.trim() && !year && !type;
  return (
    <div className="body-main">
      <SearchFilter
        searchTerm={searchTerm}
        year={year}
        type={type}
        onSearchTermChange={handleSearchChange}
        onYearChange={handleYearChange}
        onTypeChange={handleTypeChange}
      />
      <MovieList
        searchTerm={searchTerm}
        year={year}
        type={type}
        page={page}
        rowsPerPage={rowsPerPage}
      />
       {!isSearchCleared && (
        <TablePagination
          component="div"
          count={totalResults}
          page={page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
          disabled={loading}
        />
      )}
    </div>
  );
};

export default HomePage;
