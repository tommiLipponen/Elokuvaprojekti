const API_BASE = '/movies';

export async function searchMovies({ title, genre, year } = {}) {
  const params = new URLSearchParams();
  if (title) params.set('title', title);
  if (genre) params.set('genre', genre);
  if (year) params.set('year', year);

  const res = await fetch(`${API_BASE}/search?${params.toString()}`);
  return res.json();
}
