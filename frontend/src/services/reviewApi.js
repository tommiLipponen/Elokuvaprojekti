const API_BASE = '/api/reviews';

export async function getReviews(movieId) {
  const res = await fetch(`${API_BASE}?movieId=${movieId}`);
  return res.json();
}
