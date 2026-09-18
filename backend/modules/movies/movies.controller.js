const { search } = require('./movies.service');

const searchMoviesHandler = async (req, res) => {
  const { title, genre, year } = req.query;

  try {
    const movies = await search({ title, genre, year });
    return res.status(200).json(movies);
  } catch {
    return res.status(500).json({ errors: { message: 'Movie search failed' } });
  }
};

module.exports = { searchMoviesHandler };
