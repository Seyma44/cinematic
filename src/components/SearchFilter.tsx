import React from 'react';
import { TextField, Select, MenuItem } from '@mui/material';
import { SearchFilterProps } from '../types/movie';

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  year,
  type,
  onSearchTermChange,
  onYearChange,
  onTypeChange,
}) => {
  return (
    <div className="search-controls">
      <TextField
        label="Search Movies"
        value={searchTerm}
        onChange={onSearchTermChange}
        variant="outlined"
        className="search-input"
      />
      <TextField
        label="Year"
        value={year}
        onChange={onYearChange}
        variant="outlined"
        className="year-input"
        type="number"
        inputProps={{ min: 1888, max: new Date().getFullYear() }}
      />
      <Select value={type || ''} onChange={onTypeChange} variant="outlined" className="type-select">
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="movie">Movies</MenuItem>
        <MenuItem value="series">TV Series</MenuItem>
      </Select>
    </div>
  );
};

export default SearchFilter;
