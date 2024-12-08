import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { SelectChangeEvent } from '@mui/material';
import SearchFilter from '../components/SearchFilter';
import MovieList from '../components/MovieList';
import { TablePagination } from '@mui/material';
import { RootState, AppDispatch } from '../store';
import { fetchMovies } from '../store/movieSlice';
import debounce from 'lodash/debounce';
import '../styles/BodyMain.scss';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('Pokemon'); // Default to 'Pokemon'
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const { totalResults, loading } = useSelector((state: RootState) => state.movies);
  // Function to update the URL query params based on state
  const updateUrlParams = useCallback(() => {
    const queryParams = new URLSearchParams();
    if (searchTerm.trim()) queryParams.set('q', searchTerm);  // Only include if searchTerm is not empty
    if (year) queryParams.set('year', year);
    if (type) queryParams.set('type', type);
    queryParams.set('page', page.toString());

    navigate(`/?${queryParams.toString()}`, { replace: true });
  }, [searchTerm, year, type, page, navigate]);

  // Debounced search function
  const debouncedSearchRef = useRef(
    debounce((term: string, year: string, type: string, page: number) => {
      if (term.trim()) {
        dispatch(fetchMovies({ searchTerm: term, year, type, page }));
      } else {
        dispatch(fetchMovies({ searchTerm: '', year, type, page })); // Clear movies if searchTerm is empty
      }
    }, 100)
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newSearchTerm = searchParams.get('q') || searchTerm  
    const newYear = searchParams.get('year') || '';
    const newType = searchParams.get('type') || '';
    const newPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const newRowsPerPage = parseInt(searchParams.get('rowsPerPage') || '10', 10);

    setSearchTerm(newSearchTerm); 
    setYear(newYear);
    setType(newType);
    setPage(newPage);
    setRowsPerPage(newRowsPerPage);

    if (newSearchTerm.trim()) {
      debouncedSearchRef.current(newSearchTerm, newYear, newType, newPage);
    }
  }, [location.search]);


  useEffect(() => {
    updateUrlParams();  // Update the URL whenever searchTerm, year, type, or page changes
  }, [searchTerm, year, type, page, updateUrlParams]);

  // Event handlers for user interactions
  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = event.target.value;
    setYear(newYear);
    setPage(1);
    debouncedSearchRef.current(searchTerm, newYear, type, 1);
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const newType = event.target.value;
    setType(newType);
    setPage(1);
    debouncedSearchRef.current(searchTerm, year, newType, 1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm); // Update the search term with the current input value
    setPage(1);
    debouncedSearchRef.current(newSearchTerm, year, type, 1);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    const nextPage = newPage + 1;
    setPage(nextPage);
    debouncedSearchRef.current(searchTerm, year, type, nextPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1);
    debouncedSearchRef.current(searchTerm, year, type, 1);
  };

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
      <TablePagination
        component="div"
        count={totalResults}
        page={page - 1}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10]}
        disabled={loading}
      />
    </div>
  );
};

export default HomePage;
