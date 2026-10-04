import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { getReviews, submitReview } from '../services/reviewApi.js';

function Stars({ value }) {
  return (
    <span role="img" aria-label={` out of 5 stars`} style={{ color: '#f5a623' }}>
      {'★'.repeat(value)}
      {'☆'.repeat(5 - value)}
    </span>
  );
}

function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return <p>No reviews yet.</p>;
  }
  return (
    <ul>
      {reviews.map((review) => (
        <li key={review.id}>
          {review.username}: <Stars value={review.rating} /> - {review.comment}
          <br />
          <time dateTime={review.createdAt}>
            {new Date(review.createdAt).toLocaleString('fi-FI')}
          </time>
        </li>
      ))}
    </ul>
  );
}

function MovieDetailPage() {
  const { id: movieId } = useParams();
  const { user, accessToken } = useAuth() ?? {};
  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const result = await getReviews(movieId);
        setReviews(result);
      } catch (error) {
        console.error(error);
      }
    };

    loadReviews();
  }, [movieId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await submitReview(
        movieId,
        { rating: Number(rating), comment },
        accessToken,
      );

      if (response.message) {
        setMessage(response.message);
        return;
      }

      setComment('');
      setReviews(await getReviews(movieId));
      setMessage('Review submitted.');
    } catch {
      setMessage('Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Movie Detail</h1>
      <h2>Reviews</h2>
      <ReviewList reviews={reviews} />
      {user && (
        <form onSubmit={handleSubmit}>
          <h2>Write a review</h2>
          <div role="radiogroup" aria-label="Rating">
            <span>Rating </span>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={Number(rating) === value}
                aria-label={`${value} star${value > 1 ? 's' : ''}`}
                onClick={() => setRating(String(value))}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.6rem',
                  color: value <= Number(rating) ? '#f5a623' : '#aaa',
                }}
              >
                {value <= Number(rating) ? '★' : '☆'}
              </button>
            ))}
          </div>

          <label htmlFor="comment">Comment</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit review'}
          </button>
          {message && <p>{message}</p>}
        </form>
      )}
    </div>
  );
}

export default MovieDetailPage;
