/* global describe, test, expect, jest, beforeEach */

jest.mock('../modules/movies/movies.service');

const request = require('supertest');
const app = require('../app');
const { nowPlaying } = require('../modules/movies/movies.service');

describe('GET /movies/now-playing', () => {
  beforeEach(() => {
    nowPlaying.mockReset();
  });

  test('returns movies currently playing', async () => {
    const movie = { tmdbId: 550, title: 'Fight Club', releaseYear: 1999, posterUrl: null, overview: '', voteAverage: 8.4 };
    nowPlaying.mockResolvedValue([movie]);

    const response = await request(app).get('/movies/now-playing');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([movie]);
  });

  test('supports an explicit region query param', async () => {
    nowPlaying.mockResolvedValue([]);

    const response = await request(app).get('/movies/now-playing').query({ region: 'FI' });

    expect(response.statusCode).toBe(200);
    expect(nowPlaying).toHaveBeenCalledWith({ region: 'FI' });
  });

  test('returns an empty array, not an error, when nothing is playing', async () => {
    nowPlaying.mockResolvedValue([]);

    const response = await request(app).get('/movies/now-playing');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('returns a 500 error when the fetch fails', async () => {
    nowPlaying.mockRejectedValue(new Error('TMDB request failed'));

    const response = await request(app).get('/movies/now-playing');

    expect(response.statusCode).toBe(500);
    expect(response.body.errors.message).toBe('Failed to fetch now-playing movies');
  });
});
