// src/types/movie.d.ts

export interface Movie {
    type: string;
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
  }
  
  export interface MovieDetails extends Movie {
    Runtime: string;
    Genre: string;
    Director: string;
    Actors: string;
    Plot: string;
    imdbRating: string;
  }
  
  export interface MovieState {
    movies: Movie[];
    selectedMovie: MovieDetails | null;
    totalResults: number;
    loading: boolean;
    error: string | null;
  }

export interface MovieListProps {
  searchTerm: string;
  year: string;
  type: string;
  page: number;
  rowsPerPage: number;
}

export interface SearchFilterProps {
    searchTerm: string;
    year: string;
    type: string;
    onSearchTermChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onYearChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onTypeChange: (event: SelectChangeEvent<string>) => void;
  }
  
  