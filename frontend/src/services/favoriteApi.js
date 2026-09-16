const API_BASE = '/api/favorites';

export async function getFavorites() {
  const res = await fetch(API_BASE);
  return res.json();
}
