import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import Header from './components/Header';
import './App.scss';
import HomePage from './pages/HomePage';


const MovieDetails = React.lazy(() => import('./pages/MovieDetails'));

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Suspense fallback={<CircularProgress className="loading-spinner" />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
};

export default App;

