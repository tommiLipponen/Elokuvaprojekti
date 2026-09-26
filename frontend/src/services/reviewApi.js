const API_BASE = '/api/reviews';

export async function getReviews(movieId) {
  const res = await fetch(`${API_BASE}?movieId=${movieId}`);
  return res.json();
}

export async function submitReview(movieId, review, accessToken) {
  const res = await fetch(`/movies/${movieId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(review),
  });

  return res.json();
}
