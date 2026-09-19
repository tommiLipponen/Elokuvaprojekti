const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Static TMDB movie genre list (https://api.themoviedb.org/3/genre/movie/list) - rarely changes, avoids an extra request per search
const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

function getAuthHeaders() {
  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!token) {
    throw new Error('TMDB_READ_ACCESS_TOKEN is not set');
  }
  return { Authorization: `Bearer ${token}`, Accept: 'application/json' };
}

async function callTmdb(path, params = {}) {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url, { headers: getAuthHeaders() });
  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function getGenreId(genreName) {
  const match = GENRES.find((genre) => genre.name.toLowerCase() === String(genreName).toLowerCase());
  return match ? match.id : undefined;
}

// Searches TMDB for movies matching title/genre/year. Title search uses /search/movie;
// genre/year-only searches (no title) use /discover/movie, since TMDB's search endpoint doesn't filter by genre/year.
async function searchMovies({ title, genre, year } = {}) {
  const genreId = genre ? getGenreId(genre) : undefined;

  if (title) {
    const data = await callTmdb('/search/movie', { query: title, year });
    let results = data.results || [];
    if (genreId) {
      results = results.filter((movie) => movie.genre_ids?.includes(genreId));
    }
    return results;
  }

  const data = await callTmdb('/discover/movie', {
    with_genres: genreId,
    primary_release_year: year,
  });
  return data.results || [];
}

// Returns movies currently playing in cinemas for the given region (default Finland).
async function getNowPlaying({ region = 'FI' } = {}) {
  const data = await callTmdb('/movie/now_playing', { region });
  return data.results || [];
}

module.exports = { searchMovies, getGenreId, getNowPlaying, GENRES };
