import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { getMovie } from '../services/movieApi.js';
import { getReviews, submitReview } from '../services/reviewApi.js';
import { getMyGroups, addMovieToGroup } from '../services/groupApi.js';
import { getFavorites, addItemToList } from '../services/favoriteApi.js';

function Stars({ value, scale = 5 }) {
  const rating = Math.max(
    0,
    Math.min(scale, Math.round(Number(value) * 5 / scale))
  );

  return (
    <span
      className="movie-detail-stars"
      aria-label={`${value} out of ${scale}`}
    >
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </span>
  );
}

function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return <p>No reviews yet.</p>;
  }

  return (
    <ul className="movie-detail-reviews-list">
      {reviews.map((review) => (
        <li key={review.id}>
          <strong>{review.username}</strong>
          {' '}
          <Stars value={review.rating} />
          {' - '}
          {review.comment}

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
  const navigate = useNavigate();
  const { user, accessToken } = useAuth() ?? {};

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [groups, setGroups] = useState([]);
  const [favoriteLists, setFavoriteLists] = useState([]);
  const [selectedFavoriteListId, setSelectedFavoriteListId] = useState('');
  const [loadingFavoriteLists, setLoadingFavoriteLists] = useState(false);
  const [addingToFavorites, setAddingToFavorites] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState('');

  const [selectedGroupId, setSelectedGroupId] = useState('');

  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const [loadingMovie, setLoadingMovie] = useState(true);
  const [loadingReview, setLoadingReview] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadMovie() {
      try {
        const result = await getMovie(movieId);

        if (!cancelled) {
          setMovie(result);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setLoadingMovie(false);
        }
      }
    }

    loadMovie();

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      try {
        const result = await getReviews(movieId);

        if (!cancelled) {
          setReviews(result);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [movieId]);


  useEffect(() => {
    if (!accessToken) {
      return;
    }

    let cancelled = false;

    async function loadLists() {
      setLoadingFavoriteLists(true);

      try {
        const [groupResult, favoriteResult] = await Promise.all([
          getMyGroups(accessToken),
          getFavorites(accessToken),
        ]);

        if (cancelled) {
          return;
        }

        setGroups(Array.isArray(groupResult) ? groupResult : []);
        setFavoriteLists(
          Array.isArray(favoriteResult) ? favoriteResult : []
        );
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setLoadingFavoriteLists(false);
        }
      }
    }

    loadLists();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);


  async function handleAddToGroup() {
    if (!selectedGroupId) {
      return;
    }

    try {
      await addMovieToGroup(
        selectedGroupId,
        movie.tmdbId,
        accessToken,
      );

      setMessage('Movie added to group.');
    } catch (error) {
      setMessage(error.message || 'Failed to add movie to group.');
    }
  }

  async function handleAddToFavorites() {
    if (!selectedFavoriteListId) {
      setFavoriteMessage('Please choose a favorite list.');
      return;
    }

    setAddingToFavorites(true);
    setFavoriteMessage('');

    try {
      await addItemToList(
        selectedFavoriteListId,
        movie.tmdbId,
        accessToken
      );

      setFavoriteMessage('Movie added to favorites.');
    } catch (error) {
      setFavoriteMessage(
        error.message || 'Failed to add movie to favorites.'
      );
    } finally {
      setAddingToFavorites(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage('');
    setLoadingReview(true);

    try {
      const response = await submitReview(
        movieId,
        {
          rating: Number(rating),
          comment,
        },
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
      setLoadingReview(false);
    }
  }

  if (loadingMovie) {
    return (
      <div className="py-5 movie-detail-page">
        <div className="detail-page-title-row">
          <p>Loading...</p>
          <button
            type="button"
            className="btn btn-primary movie-detail-back-button"
            onClick={() => navigate(-1)}
          >
            go back
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="py-5 movie-detail-page">
        <div className="detail-page-title-row">
          <p>Movie not found.</p>
          <button
            type="button"
            className="btn btn-primary movie-detail-back-button"
            onClick={() => navigate(-1)}
          >
            go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 movie-detail-page">
      <section className="movie-detail-header">
        <div className="movie-detail-poster">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="movie-detail-image"
            />
          ) : (
            <div className="movie-detail-no-poster">
              no poster
            </div>
          )}
        </div>

        <div className="movie-detail-info">
          <div className="detail-page-title-row">
            <h1 className="movie-detail-title">
              {movie.title}
            </h1>
            <button
              type="button"
              className="btn btn-primary movie-detail-back-button"
              onClick={() => navigate(-1)}
            >
              go back
            </button>
          </div>

          {movie.releaseYear && (
            <p className="movie-detail-year">
              {movie.releaseYear}
            </p>
          )}

          {movie.genres?.length > 0 && (
            <p className="movie-detail-genre">
              {movie.genres.join(', ')}
            </p>
          )}

          <p className="movie-detail-rating">
            <Stars value={movie.voteAverage} />
            {' '}
            {Number(movie.voteAverage).toFixed(1)} / 10
          </p>

          {user && (
            <div className="movie-card-actions movie-detail-actions">
              <div className="movie-card-action">
                <select
                  id={`favorite-list-${movie.tmdbId}`}
                  className="form-select"
                  value={selectedFavoriteListId}
                  onChange={(event) =>
                    setSelectedFavoriteListId(event.target.value)
                  }
                  disabled={
                    loadingFavoriteLists || addingToFavorites
                  }
                >
                  <option value="">
                    {loadingFavoriteLists
                      ? 'Loading favorite lists...'
                      : 'Choose favorite list'}
                  </option>

                  {favoriteLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>

                {!loadingFavoriteLists &&
                  favoriteLists.length === 0 && (
                    <p className="movie-card-message">
                      No favorite lists found. Create a list first.
                    </p>
                  )}

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddToFavorites}
                  disabled={
                    !selectedFavoriteListId ||
                    loadingFavoriteLists ||
                    addingToFavorites
                  }
                >
                  {addingToFavorites
                    ? 'Adding...'
                    : 'Add to favorites.'}
                </button>

                {favoriteMessage && (
                  <p className="movie-card-message" role="status">
                    {favoriteMessage}
                  </p>
                )}
              </div>

              <div className="movie-card-action">
                <select
                  className="form-select"
                  value={selectedGroupId}
                  onChange={(event) =>
                    setSelectedGroupId(event.target.value)
                  }
                >
                  <option value="">Choose group</option>

                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddToGroup}
                  disabled={!selectedGroupId}
                >
                  Add to group.
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {message && (
        <p className="movie-detail-message">
          {message}
        </p>
      )}

      <section className="movie-detail-description">
        <h2>description</h2>

        <div className="movie-detail-description-box">
          <p>
            {movie.overview || 'No description available.'}
          </p>
        </div>
      </section>

      <section className="movie-detail-reviews">
        <h2>reviews in elokuvaprojekti</h2>

        <ReviewList reviews={reviews} />

        {user && (
          <form
            onSubmit={handleSubmit}
            className="movie-detail-review-form"
          >
            <h2>write a review</h2>

            <div
              role="radiogroup"
              aria-label="Rating"
              className="movie-detail-rating-input"
            >
              <span>Rating </span>

              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={Number(rating) === value}
                  aria-label={`${value} star${value > 1 ? 's' : ''}`}
                  className="movie-detail-rating-button"
                  onClick={() => setRating(String(value))}
                >
                  {value <= Number(rating) ? '★' : '☆'}
                </button>
              ))}
            </div>

            <label
              htmlFor="comment"
              className="form-label"
            >
              Comment
            </label>

            <textarea
              id="comment"
              className="form-control movie-detail-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              required
            />

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loadingReview}
            >
              {loadingReview ? 'Submitting...' : 'submit review'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

export default MovieDetailPage;