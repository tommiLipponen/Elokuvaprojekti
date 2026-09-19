const API_BASE = '/movies';

export async function searchMovies({ title, genre, year } = {}) {
  const params = new URLSearchParams();
  if (title) params.set('title', title);
  if (genre) params.set('genre', genre);
  if (year) params.set('year', year);

  const res = await fetch(`${API_BASE}/search?${params.toString()}`);
  return res.json();
}

export async function getNowPlaying({ region } = {}) {
  const params = new URLSearchParams();
  if (region) params.set('region', region);

  const res = await fetch(`${API_BASE}/now-playing?${params.toString()}`);
  return res.json();
}
