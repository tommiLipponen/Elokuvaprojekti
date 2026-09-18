import { useState } from 'react';
import { searchMovies } from '../services/movieApi.js';

export function useMovies() {
  const [movies, setMovies] = useState([]);

  async function search(filters) {
    const results = await searchMovies(filters);
    setMovies(results);
  }

  return { movies, search };
}
