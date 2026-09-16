const API_BASE = '/api/movies';

export async function searchMovies(query) {
  const res = await fetch(`${API_BASE}?query=${encodeURIComponent(query)}`);
  return res.json();
}
