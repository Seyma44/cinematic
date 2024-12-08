import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { SelectChangeEvent } from '@mui/material';
import SearchFilter from '../components/SearchFilter';
import MovieList from '../components/MovieList';
import { TablePagination } from '@mui/material';
import '../styles/BodyMain.scss';
import { RootState, AppDispatch } from '../store';
import { fetchMovies } from '../store/movieSlice';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const { totalResults, loading } = useSelector((state: RootState) => state.movies);

  const updateUrlParams = useCallback(() => {
    const queryParams = new URLSearchParams();
    if (searchTerm.trim()) queryParams.set('q', searchTerm);
    if (year) queryParams.set('year', year);
    if (type) queryParams.set('type', type);
    queryParams.set('page', page.toString());
   
    navigate(`/?${queryParams.toString()}`, { replace: true });
  }, [searchTerm, year, type, page, navigate]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newSearchTerm = searchParams.get('q') || 'Pokemon';
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
      dispatch(fetchMovies({ searchTerm: newSearchTerm, year: newYear, type: newType, page: newPage }));
    }
  }, [location.search, dispatch]);

  useEffect(() => {
    updateUrlParams();
  }, [searchTerm, year, type, page, rowsPerPage, updateUrlParams]);

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(event.target.value);
    setPage(1);
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setType(event.target.value);
    setPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1);
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

