/* global describe, test, expect, jest */

jest.mock('../modules/movies/movies.provider');

const { searchMovies } = require('../modules/movies/movies.provider');
const { search } = require('../modules/movies/movies.service');

describe('movies.service.search', () => {
  test('maps TMDB movies to the simplified card shape', async () => {
    searchMovies.mockResolvedValue([{
      id: 550,
      title: 'Fight Club',
      release_date: '1999-10-15',
      poster_path: '/poster.jpg',
      overview: 'An insomniac office worker...',
      vote_average: 8.4,
    }]);

    const results = await search({ title: 'Fight Club' });

    expect(results).toEqual([{
      tmdbId: 550,
      title: 'Fight Club',
      releaseYear: 1999,
      posterUrl: 'https://image.tmdb.org/t/p/w342/poster.jpg',
      overview: 'An insomniac office worker...',
      voteAverage: 8.4,
    }]);
  });

  test('returns an empty array when TMDB has no matches', async () => {
    searchMovies.mockResolvedValue([]);

    const results = await search({ title: 'zzzznonexistentmovie' });

    expect(results).toEqual([]);
  });
});
