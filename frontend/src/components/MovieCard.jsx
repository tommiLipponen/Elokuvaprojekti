import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth.js';
import {getMyGroups,addMovieToGroup,} from '../services/groupApi.js';

function MovieCard({ movie }) {
  const { accessToken } = useAuth();

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [message, setMessage] = useState('');
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [adding, setAdding] = useState(false);

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

    loadGroups();
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
    </div>
  );
}

export default MovieCard;
