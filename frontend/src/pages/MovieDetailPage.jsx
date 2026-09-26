import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { submitReview } from '../services/reviewApi.js';

function MovieDetailPage() {
  const { id: movieId } = useParams();
  const { user, accessToken } = useAuth() ?? {};
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
      {user && (
        <form onSubmit={handleSubmit}>
          <h2>Write a review</h2>
          <label htmlFor="rating">Rating</label>
          <select
            id="rating"
            value={rating}
            onChange={(event) => setRating(event.target.value)}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>

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
