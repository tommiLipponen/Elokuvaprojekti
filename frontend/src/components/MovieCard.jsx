import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth.js';
import {getMyGroups,addMovieToGroup,} from '../services/groupApi.js';
import { getFavorites, addItemToList } from '../services/favoriteApi.js';

function MovieCard({ movie }) {
  const { accessToken } = useAuth();

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [message, setMessage] = useState('');
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [adding, setAdding] = useState(false);

  const [favoriteLists, setFavoriteLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState('');
  const [favoriteMessage, setFavoriteMessage] = useState('');
  const [loadingFavoriteLists, setLoadingFavoriteLists] = useState(false);
  const [addingToFavorites, setAddingToFavorites] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    async function loadGroups() {
      try {
        setLoadingGroups(true);

        const result = await getMyGroups(accessToken);

        setGroups(result);
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
      setMessage(error.message);
    } finally {
      setAdding(false);
    }
  };

  const handleAddToFavorites = async () => {
    if (!selectedListId) {
      setFavoriteMessage('Select a favorite list first');
      return;
    }

    try {
      setAddingToFavorites(true);
      setFavoriteMessage('');

      await addItemToList(selectedListId, movie.tmdbId, accessToken);

      setFavoriteMessage('Movie added to favorite list!');
    } catch (error) {
      setFavoriteMessage(error.message);
    } finally {
      setAddingToFavorites(false);
    }
  };

  return (
    <div className="movie-card">
      {movie.posterUrl && (
        <img src={movie.posterUrl} alt={movie.title} />
      )}

      <h3>{movie.title}</h3>

      {movie.releaseYear && <p>{movie.releaseYear}</p>}

      {accessToken && (
        <div>
          <select
            value={selectedGroupId}
            onChange={(event) => setSelectedGroupId(event.target.value)}
            disabled={loadingGroups || adding}
          >
            <option value="">Select a group</option>

            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAddToGroup}
            disabled={!selectedGroupId || adding}
          >
            {adding ? 'Adding...' : 'Add to group'}
          </button>

          {message && <p>{message}</p>}
        </div>
      )}

      {accessToken && (
        <div>
          <select
            value={selectedListId}
            onChange={(event) => setSelectedListId(event.target.value)}
            disabled={loadingFavoriteLists || addingToFavorites}
          >
            <option value="">Select a favorite list</option>

            {favoriteLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAddToFavorites}
            disabled={!selectedListId || addingToFavorites}
          >
            {addingToFavorites ? 'Adding...' : 'Add to favorite list'}
          </button>

          {favoriteMessage && <p>{favoriteMessage}</p>}
        </div>
      )}
    </div>
  );
}

export default MovieCard;
