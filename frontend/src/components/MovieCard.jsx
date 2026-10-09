import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import {
  getMyGroups,
  addMovieToGroup,
} from '../services/groupApi.js';
import {
  getFavorites,
  addItemToList,
} from '../services/favoriteApi.js';

function MovieCard({ movie }) {
  const { accessToken } = useAuth();

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [message, setMessage] = useState('');
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [adding, setAdding] = useState(false);

  const [favoriteLists, setFavoriteLists] = useState([]);
  const [favoriteMessage, setFavoriteMessage] = useState('');
  const [loadingFavoriteLists, setLoadingFavoriteLists] = useState(false);
  const [addingToFavorites, setAddingToFavorites] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      setGroups([]);
      setFavoriteLists([]);
      return;
    }

    async function loadGroups() {
      try {
        setLoadingGroups(true);

        const result = await getMyGroups(accessToken);
        setGroups(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error(error);
        setMessage('Failed to load groups');
      } finally {
        setLoadingGroups(false);
      }
    }

    async function loadFavoriteLists() {
      try {
        setLoadingFavoriteLists(true);

        const result = await getFavorites(accessToken);
        setFavoriteLists(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error(error);
        setFavoriteMessage('Failed to load favorite lists');
      } finally {
        setLoadingFavoriteLists(false);
      }
    }

    loadGroups();
    loadFavoriteLists();
  }, [accessToken]);

  const handleAddToGroup = async () => {
    if (!selectedGroupId) {
      setMessage('Select a group first');
      return;
    }

    try {
      setAdding(true);
      setMessage('');

      await addMovieToGroup(
        selectedGroupId,
        movie.tmdbId,
        accessToken
      );

      setMessage('Movie added to group!');
    } catch (error) {
      setMessage(error.message || 'Failed to add movie to group');
    } finally {
      setAdding(false);
    }
  };

  const handleAddToFavorites = async () => {
    const favoriteList = favoriteLists[0];

    if (!favoriteList) {
      setFavoriteMessage('No favorites list found');
      return;
    }

    try {
      setAddingToFavorites(true);
      setFavoriteMessage('');

      await addItemToList(
        favoriteList.id,
        movie.tmdbId,
        accessToken
      );

      setFavoriteMessage('Movie added to favorites!');
    } catch (error) {
      setFavoriteMessage(
        error.message || 'Failed to add movie to favorites'
      );
    } finally {
      setAddingToFavorites(false);
    }
  };

  const posterUrl =
    movie.posterUrl ||
    (movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null);


  return (
    <div className="movie-card">
      <div className="movie-card-poster">
        {posterUrl ? (
          <Link to={`/movies/${movie.tmdbId}`}>
            <img
              src={posterUrl}
              alt={movie.title}
              className="movie-card-image"
            />
          </Link>
        ) : (
          <div className="movie-card-no-poster">
            no poster
          </div>
        )}
      </div>

      <div className="movie-card-content">
        <h1 className="movie-card-title">
          <Link to={`/movies/${movie.tmdbId}`}>
            {movie.title}
          </Link>
        </h1>

        {movie.releaseYear && (
          <p className="movie-card-year">
            {movie.releaseYear}
          </p>
        )}

        {movie.overview && (
          <p className="movie-card-overview">
            {movie.overview}
          </p>
        )}

        <Link
          to={`/movies/${movie.tmdbId}`}
          className="movie-card-reviews"
        >
          Read reviews.
        </Link>

        {accessToken && (
          <div className="movie-card-actions">
            <div className="movie-card-action">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddToFavorites}
                disabled={loadingFavoriteLists || addingToFavorites}
              >
                {loadingFavoriteLists
                  ? 'loading...'
                  : addingToFavorites
                    ? 'adding...'
                    : 'add to favorites'}
              </button>

              {favoriteMessage && (
                <p className="movie-card-message">
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
                disabled={loadingGroups || adding}
              >
                <option value="">choose group</option>

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
                disabled={!selectedGroupId || adding}
              >
                {adding ? 'adding...' : 'add to group'}
              </button>

              {message && (
                <p className="movie-card-message">
                  {message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieCard;