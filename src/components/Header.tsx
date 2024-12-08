import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import '../styles/Header.scss';

const Header: React.FC = () => {
  return (
    <AppBar position="static" className="header">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" className="logo">
          CineSearch
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

