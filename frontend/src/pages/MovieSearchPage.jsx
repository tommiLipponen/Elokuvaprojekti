import { useState } from 'react';
import { useMovies } from '../hooks/useMovies.js';
import MovieCard from '../components/MovieCard.jsx';

// Mirrors the genre list in backend/modules/movies/movies.provider.js
const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama',
  'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance',
  'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western',
];

function MovieSearchPage() {
  const { movies, search } = useMovies();
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    await search({ title, genre, year });
    setHasSearched(true);
  }

  return (
    <div>
      <h1>Movie Search</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search by title..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <select value={genre} onChange={(event) => setGenre(event.target.value)}>
          <option value="">Genre</option>
          {GENRES.map((genreOption) => (
            <option key={genreOption} value={genreOption}>{genreOption}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(event) => setYear(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {hasSearched && movies.length === 0 && <p>No movies found.</p>}

      <div className="movie-results">
        {movies.map((movie) => (
          <MovieCard key={movie.tmdbId} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default MovieSearchPage;
