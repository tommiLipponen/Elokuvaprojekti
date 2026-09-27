import { useState } from 'react';
import { useAuth } from '../context/useAuth.js';
import * as favoriteApi from '../services/favoriteApi.js';

export function useFavorites() {
  const { accessToken } = useAuth();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadLists() {
    setLoading(true);
    setError('');

    try {
      const results = await favoriteApi.getFavorites(accessToken);
      setLists(Array.isArray(results) ? results : []);
    } catch {
      setError('Failed to load favorite lists.');
    } finally {
      setLoading(false);
    }
  }

  async function addList(name) {
    const list = await favoriteApi.createFavoriteList(name, accessToken);
    if (list.message) {
      throw new Error(list.message);
    }

    setLists((current) => [list, ...current]);
    return list;
  }

  async function removeMovie(listId, movieId) {
    const result = await favoriteApi.removeItemFromList(listId, movieId, accessToken);
    if (result?.message) {
      throw new Error(result.message);
    }

    setLists((current) =>
      current.map((list) =>
        list.id === listId
          ? { ...list, items: list.items.filter((item) => item.movieId !== movieId) }
          : list
      )
    );
  }

  return { lists, loading, error, loadLists, addList, removeMovie };
}
