import React from 'react';
import { TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface SearchFilterProps {
  searchTerm: string;
  year: string;
  type: string;
  onSearchTermChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onYearChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (event: SelectChangeEvent<string>) => void;
}

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
        <MenuItem value="">All</MenuItem>
        <MenuItem value="movie">Movies</MenuItem>
        <MenuItem value="series">TV Series</MenuItem>
      </Select>
    </div>
  );
};

export default SearchFilter;
