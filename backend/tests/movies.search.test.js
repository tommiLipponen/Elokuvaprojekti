/* global describe, test, expect, jest, beforeEach */

jest.mock('../modules/movies/movies.service');

const request = require('supertest');
const app = require('../app');
const { search } = require('../modules/movies/movies.service');

describe('GET /movies/search', () => {
  beforeEach(() => {
    search.mockReset();
  });

  test('returns matching movies for a valid query', async () => {
    const movie = { tmdbId: 550, title: 'Fight Club', releaseYear: 1999, posterUrl: null, overview: '', voteAverage: 8.4 };
    search.mockResolvedValue([movie]);

    const response = await request(app).get('/movies/search').query({ title: 'Fight Club' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([movie]);
  });

  test('returns an empty array, not an error, when nothing matches', async () => {
    search.mockResolvedValue([]);

    const response = await request(app).get('/movies/search').query({ title: 'zzzznonexistentmovie' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('supports searching with no query params (empty query)', async () => {
    search.mockResolvedValue([]);

    const response = await request(app).get('/movies/search');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
    expect(search).toHaveBeenCalledWith({ title: undefined, genre: undefined, year: undefined });
  });

  test('returns a 500 error when the search fails', async () => {
    search.mockRejectedValue(new Error('TMDB request failed'));

    const response = await request(app).get('/movies/search').query({ title: 'Fight Club' });

    expect(response.statusCode).toBe(500);
    expect(response.body.errors.message).toBe('Movie search failed');
  });
});
