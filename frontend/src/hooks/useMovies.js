import { useCallback, useState } from 'react';
import { searchMovies } from '../services/movieApi.js';

export function useMovies() {
  const [movies, setMovies] = useState([]);

  const search = useCallback(async (filters) => {
    const results = await searchMovies(filters);
    setMovies(results);
  }, []);

  return { movies, search };
}
