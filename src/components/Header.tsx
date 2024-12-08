import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1.5rem',
            transition: 'color 0.3s ease',
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
