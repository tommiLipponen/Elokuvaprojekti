export async function getReviews(movieId) {
  const res = await fetch(`/movies/${movieId}/reviews`);
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
