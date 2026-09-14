import { useState } from 'react';
import { searchMovies } from '../services/movieApi.js';

export function useMovies() {
  const [movies, setMovies] = useState([]);

  async function search(query) {
    const results = await searchMovies(query);
    setMovies(results);
  }

  return { movies, search };
}
