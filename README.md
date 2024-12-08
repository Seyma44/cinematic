# Movie Search App

This is a Single Page Application that allows users to list and view details of movies using the OMDb API.

## Features

- List movies in a grid
- Search for movies by name
- Filter movies by year and type (movie, series, episode)
- Pagination (10 movies per page)
- View detailed information about a selected movie

## Technologies Used

- React
- TypeScript
- Vite
- Redux Toolkit
- Material UI
- Sass
- Axios

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/movie-search-app.git
   cd movie-search-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your OMDb API key:
   ```
   VITE_OMDB_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` to view the app.

## Building for Production

To create a production build, run:

```
npm run build
```

The built files will be in the `dist` directory.

## License

This project is open source and available under the [MIT License](LICENSE).