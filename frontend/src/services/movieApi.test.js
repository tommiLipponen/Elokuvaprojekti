import { afterEach, describe, expect, it, vi } from 'vitest';
import { searchMovies, getMovie, getPopularMovies, getNowPlaying } from './movieApi.js';

function mockFetchOnce(body, { status = 200 } = {}) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  }));
}

describe('movieApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('searchMovies builds the query string from the given filters', async () => {
    mockFetchOnce({ results: [] });

    await searchMovies({ title: 'fight club', year: 1999 });

    expect(fetch).toHaveBeenCalledWith('/movies/search?title=fight+club&year=1999');
  });

  it('searchMovies omits empty filters from the query string', async () => {
    mockFetchOnce({ results: [] });

    await searchMovies({});

    expect(fetch).toHaveBeenCalledWith('/movies/search?');
  });

  it('getMovie resolves with the movie on success', async () => {
    mockFetchOnce({ id: 550, title: 'Fight Club' });

    const result = await getMovie(550);

    expect(result.title).toBe('Fight Club');
  });

  it('getMovie throws when the movie is not found', async () => {
    mockFetchOnce({ message: 'Not found' }, { status: 404 });

    await expect(getMovie(999999)).rejects.toThrow('Failed to fetch movie');
  });

  it('getPopularMovies throws on a server error', async () => {
    mockFetchOnce({ message: 'Server error' }, { status: 500 });

    await expect(getPopularMovies()).rejects.toThrow('Failed to fetch popular movies');
  });

  it('getNowPlaying includes the region in the query string when provided', async () => {
    mockFetchOnce({ results: [] });

    await getNowPlaying({ region: 'FI' });

    expect(fetch).toHaveBeenCalledWith('/movies/now-playing?region=FI');
  });
});
