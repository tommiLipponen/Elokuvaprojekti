import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getFavorites,
  addItemToList,
  removeItemFromList,
  updateFavoriteListVisibility,
} from '../src/services/favoriteApi.js';

function mockFetchOnce(body, { status = 200 } = {}) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  }));
}

describe('favoriteApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('getFavorites returns the list of favorite lists', async () => {
    mockFetchOnce([{ id: '1', name: 'My list' }]);

    const result = await getFavorites('token');

    expect(result).toHaveLength(1);
    expect(fetch).toHaveBeenCalledWith(
      '/api/favorites',
      expect.objectContaining({ headers: { Authorization: 'Bearer token' } })
    );
  });

  it('addItemToList resolves with the added item on success', async () => {
    mockFetchOnce({ id: '1', movieId: 550 }, { status: 201 });

    const result = await addItemToList('list-1', 550, 'token');

    expect(result.movieId).toBe(550);
  });

  it('addItemToList throws when the movie is already in the list', async () => {
    mockFetchOnce({ message: 'Movie already in this list' }, { status: 409 });

    await expect(addItemToList('list-1', 550, 'token')).rejects.toThrow(
      'Movie already in this list'
    );
  });

  it('removeItemFromList resolves with null on success', async () => {
    mockFetchOnce(null, { status: 204 });

    const result = await removeItemFromList('list-1', 550, 'token');

    expect(result).toBeNull();
  });

  it('removeItemFromList returns the error body when the item is not found', async () => {
    mockFetchOnce({ message: 'Item not found' }, { status: 404 });

    const result = await removeItemFromList('list-1', 550, 'token');

    expect(result.message).toBe('Item not found');
  });

  it('updateFavoriteListVisibility throws when the user is not the owner', async () => {
    mockFetchOnce({ message: 'Not the owner of this list' }, { status: 403 });

    await expect(
      updateFavoriteListVisibility('list-1', true, 'token')
    ).rejects.toThrow('Not the owner of this list');
  });
});
