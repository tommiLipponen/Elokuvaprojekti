const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const RESULTS_PER_PAGE = 20;

function getAuthHeaders() {
  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!token) {
    throw new Error('TMDB_READ_ACCESS_TOKEN must be set to fetch data from TMDB');
  }
  return { Authorization: `Bearer ${token}`, Accept: 'application/json' };
}

async function fetchTmdbPage(path, params = {}) {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url, { headers: getAuthHeaders() });
  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status} ${response.statusText}): ${path}`);
  }
  return response.json();
}

async function fetchMovieList(path, { pages = 1, params = {} } = {}) {
  const results = [];
  for (let page = 1; page <= pages; page += 1) {
    const data = await fetchTmdbPage(path, { ...params, page });
    results.push(...(data.results || []));
    if (page >= (data.total_pages || 1)) break;
  }
  return results;
}

// TMDB list endpoints (popular/now_playing/top_rated) don't return runtime or status,
// only the movie detail endpoint does. Those fields are defaulted here and can be
// backfilled later with a per-movie detail lookup if exact values become necessary.
function mapTmdbMovieToRecord(movie) {
  if (!movie.release_date) return null;
  return {
    tmdbId: movie.id,
    title: movie.title,
    originalTitle: movie.original_title || movie.title,
    overview: movie.overview || '',
    posterPath: movie.poster_path || '',
    backdropPath: movie.backdrop_path || '',
    releaseDate: movie.release_date,
    runtime: 0,
    status: 'Released',
    voteAverage: movie.vote_average ?? 0,
    voteCount: movie.vote_count ?? 0,
    popularity: movie.popularity ?? 0,
  };
}

/**
 * Fetches a curated, deduplicated movie set from TMDB's popular, now-playing (Finland),
 * and top-rated lists, capped at targetCount.
 */
async function fetchCuratedMovies({ targetCount = 1500 } = {}) {
  const pagesPerList = Math.ceil(targetCount / 3 / RESULTS_PER_PAGE);

  const [popular, nowPlayingFi, topRated] = await Promise.all([
    fetchMovieList('/movie/popular', { pages: pagesPerList }),
    fetchMovieList('/movie/now_playing', { pages: pagesPerList, params: { region: 'FI' } }),
    fetchMovieList('/movie/top_rated', { pages: pagesPerList }),
  ]);

  const byTmdbId = new Map();
  [...popular, ...nowPlayingFi, ...topRated].forEach((movie) => {
    const record = mapTmdbMovieToRecord(movie);
    if (record) byTmdbId.set(record.tmdbId, record);
  });

  return [...byTmdbId.values()].slice(0, targetCount);
}

async function fetchGenres() {
  const data = await fetchTmdbPage('/genre/movie/list');
  return (data.genres || []).map((genre) => ({ tmdbGenreId: genre.id, name: genre.name }));
}

/** Upserts movies keyed by tmdbId, so re-running the import updates rather than duplicates. */
async function upsertMovies(prisma, movies) {
  for (const movie of movies) {
    const record = { ...movie, releaseDate: new Date(movie.releaseDate) };
    await prisma.movie.upsert({
      where: { tmdbId: record.tmdbId },
      create: record,
      update: record,
    });
  }
  return movies.length;
}

async function upsertGenres(prisma, genres) {
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { tmdbGenreId: genre.tmdbGenreId },
      create: genre,
      update: genre,
    });
  }
  return genres.length;
}

module.exports = {
  fetchCuratedMovies,
  fetchGenres,
  upsertMovies,
  upsertGenres,
};
