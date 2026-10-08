const { searchMovies, getNowPlaying, getMovieDetails} = require('./movies.provider');

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';

function toMovieCard(movie) {
  return {
    tmdbId: movie.id,
    title: movie.title,
    releaseYear: movie.release_date ? Number(movie.release_date.slice(0, 4)) : null,
    posterUrl: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null,
    overview: movie.overview,
    voteAverage: movie.vote_average,
  };
}

function toMovieDetails(movie) {
  return {
    tmdbId: movie.id,
    title: movie.title,
    releaseYear: movie.release_date ? Number(movie.release_date.slice(0, 4)) : null,
    posterUrl: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null,
    overview: movie.overview,
    voteAverage: movie.vote_average,
    genres: movie.genres?.map((genre) => genre.name) ?? [],
  };
}

// Returns an empty array (never throws) when nothing matches, per PBI 5's no-match acceptance criterion.
async function search({ title, genre, year }) {
  const results = await searchMovies({ title, genre, year });
  return results.map(toMovieCard);
}

// Returns an empty array (never throws) when nothing is currently playing.
async function nowPlaying({ region } = {}) {
  const results = await getNowPlaying({ region });
  return results.map(toMovieCard);
}

async function getMovie(tmdbId) {
  const movie = await getMovieDetails(tmdbId);
  return toMovieDetails(movie);
}

module.exports = { search, nowPlaying, getMovie };
