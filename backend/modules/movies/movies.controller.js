const { search, nowPlaying, getMovie, popular } = require('./movies.service');

const searchMoviesHandler = async (req, res) => {
  const { title, genre, year } = req.query;

  try {
    const movies = await search({ title, genre, year });
    return res.status(200).json(movies);
  } catch {
    return res.status(500).json({ errors: { message: 'Movie search failed' } });
  }
};

const nowPlayingHandler = async (req, res) => {
  const { region } = req.query;

  try {
    const movies = await nowPlaying({ region });
    return res.status(200).json(movies);
  } catch {
    return res.status(500).json({ errors: { message: 'Failed to fetch now-playing movies' } });
  }
};

const getMovieHandler = async (req, res) => {
  const { tmdbId } = req.params;

  try {
    const movie = await getMovie(tmdbId);
    return res.status(200).json(movie);
  } catch {
    return res.status(500).json({
      errors: { message: 'Failed to fetch movie' },
    });
  }
};

const popularHandler = async (req, res) => {
  try {
    const movies = await popular();
    return res.status(200).json(movies);
  } catch {
    return res.status(500).json({
      errors: { message: 'Failed to fetch popular movies' },
    });
  }
};

module.exports = { searchMoviesHandler, nowPlayingHandler, getMovieHandler, popularHandler };
