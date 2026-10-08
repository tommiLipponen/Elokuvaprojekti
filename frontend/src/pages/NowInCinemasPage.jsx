import { useEffect, useState } from 'react';
import { getNowPlaying } from '../services/movieApi.js';
import MovieCard from '../components/MovieCard.jsx';

function NowInCinemasPage() {
  const [movies, setMovies] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadNowPlaying() {
      const results = await getNowPlaying({ region: 'FI' });
      if (!cancelled) {
        setMovies(results);
        setHasLoaded(true);
      }
    }

    loadNowPlaying();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container py-5 now-playing-page">
      <h1 className="now-playing-title">
        now in Finnish cinemas
      </h1>

      {hasLoaded && movies.length === 0 && (
        <p>No movies currently playing.</p>
      )}

      <div className="movie-results">
        {movies.map((movie) => (
          <MovieCard key={movie.tmdbId} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default NowInCinemasPage;


