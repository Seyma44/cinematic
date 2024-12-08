import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardMedia, Typography, Chip, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { fetchMovieDetails } from '../store/movieSlice';
import { RootState, AppDispatch } from '../store';
import defaultImageUrl from '../assets/default-image.png';
import '../styles/MovieDetails.scss';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedMovie, loading, error } = useSelector((state: RootState) => state.movies);

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieDetails(id));
    }
  }, [dispatch, id]);

  const handleBack = () => {
    const previousLocation = location.state?.from || '/';
    navigate(previousLocation);
  };

  const getDefaultValue = (value: string | undefined) =>
    value && value !== 'N/A' ? value : 'Not available';

  const getImageSource = (imageUrl: string | undefined) =>
    imageUrl && imageUrl !== 'N/A' ? imageUrl : defaultImageUrl;

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;
  if (!selectedMovie) return <p className="no-movie-text">No movie selected</p>;

  return (
    <div className="movie-details">
      <div className="back-button">
        <IconButton onClick={handleBack} color="primary">
          <ArrowBack fontSize="large" />
        </IconButton>
      </div>
      <Card className="details-card">
        <CardMedia
          component="img"
          height="500"
          image={getImageSource(selectedMovie.Poster)}
          alt={getDefaultValue(selectedMovie.Title)}
          className="movie-poster"
        />
        <CardContent className="details-content">
          <Typography variant="h4" className="movie-title">
            {getDefaultValue(selectedMovie.Title)}
          </Typography>
          <Typography className="movie-info">
            Duration: {getDefaultValue(selectedMovie.Runtime)}
          </Typography>
          <Typography className="movie-info">
            Genre:
            {selectedMovie.Genre !== 'N/A'
              ? selectedMovie.Genre.split(', ').map((genre, index) => (
                  <Chip key={index} label={genre} className="genre-chip" />
                ))
              : 'Not available'}
          </Typography>
          <Typography className="movie-info">Director: {getDefaultValue(selectedMovie.Director)}</Typography>
          <Typography className="movie-info">Actors: {getDefaultValue(selectedMovie.Actors)}</Typography>
          <Typography className="movie-info">Plot: {getDefaultValue(selectedMovie.Plot)}</Typography>
          <Typography className="movie-info">IMDb Rating: {getDefaultValue(selectedMovie.imdbRating)}</Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default MovieDetails;

