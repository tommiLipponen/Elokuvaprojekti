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
    <main className="container py-5 movie-search-page">

      <h2 className="shared-lists-title">
        search for movies by...
      </h2>

      <form onSubmit={handleSubmit} className="movie-search-form">
        <input
          type="text"
          className="form-control movie-search-input"
          placeholder="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <div className="movie-search-filters">
          <select
            className="form-select"
            placeholder="genre"
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
          >
            <option value="">Genre</option>
            {GENRES.map((genreOption) => (
              <option
                key={genreOption}
                value={genreOption}
              >
                {genreOption}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="form-control"
            placeholder="year"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />

          <button
            type="submit"
            className="btn btn-primary movie-search-button"
          >
            search!
          </button>
        </div>
      </form>

      {hasSearched && (
        <>
        <hr className="movie-search-divider" />

      <h2 className="movie-search-results-title">
        search results
      </h2>

      {movies.length === 0 && (
        <p className="movie-search-empty">
          No movies found.
        </p>
      )}

      <div className="movie-results">
        {movies.map((movie) => (
          <MovieCard key={movie.tmdbId} movie={movie} />
        ))}
      </div>
      </>
      )}
    </main>
  );
}

export default MovieSearchPage;
