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

  const [groupsState, setGroupsState] = useState({
    token: null,
    data: [],
  });

  const [favoritesState, setFavoritesState] = useState({
    token: null,
    data: [],
  });

  const groups =
    groupsState.token === accessToken
      ? groupsState.data
      : [];

  const favoriteLists =
    favoritesState.token === accessToken
      ? favoritesState.data
      : [];

  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedFavoriteListId, setSelectedFavoriteListId] =
    useState('');

  const [message, setMessage] = useState('');
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [adding, setAdding] = useState(false);

  const [favoriteMessage, setFavoriteMessage] = useState('');
  const [loadingFavoriteLists, setLoadingFavoriteLists] =
    useState(false);
  const [addingToFavorites, setAddingToFavorites] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!accessToken) {
      return () => {
        cancelled = true;
      };
    }

    async function loadGroups() {
      try {
        setLoadingGroups(true);

        const result = await getMyGroups(accessToken);

        if (!cancelled) {
          setGroupsState({
            token: accessToken,
            data: Array.isArray(result) ? result : [],
          });
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setMessage('Failed to load groups');
        }
      } finally {
        if (!cancelled) {
          setLoadingGroups(false);
        }
      }
    }

    async function loadFavoriteLists() {
      try {
        setLoadingFavoriteLists(true);

        const result = await getFavorites(accessToken);

        if (!cancelled) {
          setFavoritesState({
            token: accessToken,
            data: Array.isArray(result) ? result : [],
          });
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setFavoriteMessage('Failed to load favorite lists');
        }
      } finally {
        if (!cancelled) {
          setLoadingFavoriteLists(false);
        }
      }
    }

    loadGroups();
    loadFavoriteLists();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const handleAddToGroup = async () => {
    if (!accessToken) {
      return;
    }

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
    if (!accessToken) {
      return;
    }

    if (!selectedFavoriteListId) {
      setFavoriteMessage('Select a favorite list first');
      return;
    }

    try {
      setAddingToFavorites(true);
      setFavoriteMessage('');

      await addItemToList(
        selectedFavoriteListId,
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
              <label
                htmlFor={`favorite-list-${movie.tmdbId}`}
                className="form-label"
              >
                Favorite list
              </label>

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
                  : 'Add to favorites'}
              </button>

              {favoriteMessage && (
                <p className="movie-card-message" role="status">
                  {favoriteMessage}
                </p>
              )}
            </div>

            <div className="movie-card-action">
              <label
                htmlFor={`group-${movie.tmdbId}`}
                className="form-label"
              >
                Group
              </label>

              <select
                id={`group-${movie.tmdbId}`}
                className="form-select"
                value={selectedGroupId}
                onChange={(event) =>
                  setSelectedGroupId(event.target.value)
                }
                disabled={loadingGroups || adding}
              >
                <option value="">
                  {loadingGroups
                    ? 'Loading groups...'
                    : 'Choose group'}
                </option>

                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>

              {!loadingGroups && groups.length === 0 && (
                <p className="movie-card-message">
                  No groups found.
                </p>
              )}

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddToGroup}
                disabled={
                  !selectedGroupId || loadingGroups || adding
                }
              >
                {adding ? 'Adding...' : 'Add to group'}
              </button>

              {message && (
                <p className="movie-card-message" role="status">
                  {message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieCard;