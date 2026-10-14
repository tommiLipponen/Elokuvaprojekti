import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMovies } from '../hooks/useMovies.js';
import MovieCard from '../components/MovieCard.jsx';

// Mirrors the genre list in backend/modules/movies/movies.provider.js
const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama',
  'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance',
  'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western',
];

function MovieSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.toString();

  return (
    <MovieSearchForm
      key={searchQuery}
      searchParams={searchParams}
      searchQuery={searchQuery}
      setSearchParams={setSearchParams}
    />
  );
}

function MovieSearchForm({ searchParams, searchQuery, setSearchParams }) {
  const { movies, search } = useMovies();
  const [title, setTitle] = useState(() => searchParams.get('title') ?? '');
  const [genre, setGenre] = useState(() => searchParams.get('genre') ?? '');
  const [year, setYear] = useState(() => searchParams.get('year') ?? '');
  const [hasSearched, setHasSearched] = useState(
    () => searchParams.get('searched') === '1',
  );
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(searchQuery);
    const filters = {
      title: params.get('title') ?? '',
      genre: params.get('genre') ?? '',
      year: params.get('year') ?? '',
    };
    const shouldSearch = params.get('searched') === '1';

    if (shouldSearch) {
      search(filters).catch((error) => {
        console.error(error);
        setSearchError('Failed to search movies.');
      });
    }
  }, [search, searchQuery]);

  async function handleSubmit(event) {
    event.preventDefault();

    const params = new URLSearchParams();
    if (title) params.set('title', title);
    if (genre) params.set('genre', genre);
    if (year) params.set('year', year);
    params.set('searched', '1');

    setHasSearched(true);
    setSearchError('');

    if (params.toString() === searchQuery) {
      try {
        await search({ title, genre, year });
      } catch (error) {
        console.error(error);
        setSearchError('Failed to search movies.');
      }
    } else {
      setSearchParams(params);
    }
  }

  return (
    <div className="py-5 movie-search-page">

      <h1 className="movie-search-title">
        search for movies by...
      </h1>

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
            <option value="">genre</option>
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
            <span>search!</span>
          </button>
        </div>
      </form>

      {hasSearched && (
        <>
        <hr className="movie-search-divider" />

      {searchError && (
        <p className="movie-search-empty" role="alert">
          {searchError}
        </p>
      )}

      {!searchError && movies.length === 0 && (
        <p className="movie-search-empty">
          No movies found.
        </p>
      )}

      {!searchError && (
        <div className="movie-results">
          {movies.map((movie) => (
            <MovieCard key={movie.tmdbId} movie={movie} />
          ))}
        </div>
      )}
      </>
      )}
    </div>
  );
}

export default MovieSearchPage;
