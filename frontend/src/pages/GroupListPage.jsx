import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import * as groupApi from '../services/groupApi.js';

function GroupListPage() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadGroups() {
      try {
        const result = await groupApi.getGroups();

        if (cancelled) return;

        if (result.message) {
          setError(result.message);
        } else {
          setGroups(result);
        }

        setHasLoaded(true);
      } catch {
        if (!cancelled) {
          setError('Failed to load groups');
          setHasLoaded(true);
        }
      }
    }

    loadGroups();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreateGroup = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError('Group name is required');
      return;
    }

    setError('');
    setIsCreating(true);

    try {
      const result = await groupApi.createGroup(
        name.trim(),
        accessToken
      );

      if (result.message) {
        setError(result.message);
        return;
      }

      setGroups((currentGroups) => [result, ...currentGroups]);
      setName('');
    } catch {
      setError('Failed to create group');
    } finally {
      setIsCreating(false);
    }
  };

  if (!hasLoaded) {
    return <p>Loading groups...</p>;
  }

  return (
    <div>
      <h1>Groups</h1>

      {accessToken && (
        <form onSubmit={handleCreateGroup}>
          <h2>Create a group</h2>

          <label htmlFor="group-name">
            Group name
          </label>

          <input
            id="group-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter group name"
          />

          <button type="submit" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      )}

      {error && <p>{error}</p>}

      {groups.length === 0 ? (
        <p>No groups yet.</p>
      ) : (
        <ul>
          {groups.map((group) => (
            <li key={group.id}>
              <button onClick={() => navigate(`/groups/${group.id}`)}>
                {group.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GroupListPage;