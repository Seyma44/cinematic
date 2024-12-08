import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchFilter from '../components/SearchFilter'; // Import SearchFilter component
import MovieList from '../components/MovieList';
import '../styles/BodyMain.scss';
import { SelectChangeEvent } from '@mui/material';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [year, setYear] = useState('');
  const [type, setType] = useState('all'); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || 'Pokemon';
    setSearchTerm(query);
    setYear(searchParams.get('year') || '');
    setType(searchParams.get('type') || ''); 
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (searchTerm.trim()) queryParams.set('q', searchTerm);
    if (year) queryParams.set('year', year);
    if (type) queryParams.set('type', type);

    navigate(`/?${queryParams.toString()}`, { replace: true });
  }, [searchTerm, year, type, navigate]);

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(event.target.value);
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setType(event.target.value);
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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
      <MovieList />
    </div>
  );
};

export default HomePage;
