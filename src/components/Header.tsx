import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import {  useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchTerm, setYear, setType, setPage } from '../store/searchFilterSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Clear search filters on logo click
  const handleLogoClick = () => {
    dispatch(setSearchTerm(''));
    dispatch(setYear(''));
    dispatch(setType(''));
    dispatch(setPage(1));
    navigate('/');  // Navigate to the homepage
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          onClick={handleLogoClick}  // Add click handler here
          sx={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1.5rem',
            transition: 'color 0.3s ease',
            cursor: 'pointer',  // Add pointer cursor for clarity
            '&:hover': {
              color: 'primary.main', 
            },
          }}
        >
          CineSearch
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
