import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import * as groupApi from '../services/groupApi.js';

function GroupListPage() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [myGroupIds, setMyGroupIds] = useState([]);

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

        if (accessToken) {
          const myGroups = await groupApi.getMyGroups(accessToken);

          if (cancelled) return;

          setMyGroupIds(myGroups.map((group) => group.id));
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
  }, [accessToken]);

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

  const handleJoinRequest = async (groupId) => {
    setError('');

    try {
      const result = await groupApi.requestToJoinGroup(
        groupId,
        accessToken
      );

      if (result.message) {
        setError(result.message);
      }
    } catch {
      setError('Failed to send join request');
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!hasLoaded) {
    return (
      <main className="container py-5 group-page">
        <p>Loading groups...</p>
      </main>
    );
  }

  return (
    <main className="container py-5 group-page">
      <div className="group-header">
        <h1 className="group-title">Groups</h1>

        {accessToken && (
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#createGroupModal"
          >
            Create Group
          </button>
        )}
      </div>

      <div className="group-search">
        <input
          type="text"
          className="form-control"
          placeholder="Search groups..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error && <p className="group-error">{error}</p>}

      {filteredGroups.length === 0 ? (
        <p className="group-empty">No groups found.</p>
      ) : (
        <div className="group-list">
          {filteredGroups.map((group) => {
            const isMyGroup = myGroupIds.includes(group.id);

            return (
              <div className="group-row" key={group.id}>
                <span className="group-name">{group.name}</span>

                <span className="group-members">
                  {group.members?.length ?? group.memberCount ?? 0} members
                </span>

                {accessToken && isMyGroup ? (
                  <button
                    type="button"
                    className="btn btn-primary group-button"
                    onClick={() => navigate(`/groups/${group.id}`)}
                  >
                    Open
                  </button>
                ) : accessToken ? (
                  <button
                    type="button"
                    className="btn btn-primary group-button"
                    onClick={() => handleJoinRequest(group.id)}
                  >
                    Request to join
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {accessToken && (
        <div
          className="modal fade"
          id="createGroupModal"
          tabIndex="-1"
          aria-labelledby="createGroupModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title" id="createGroupModalLabel">
                  Create a group
                </h2>

                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>

              <form onSubmit={handleCreateGroup}>
                <div className="modal-body">
                  <label htmlFor="group-name" className="form-label">
                    Group name
                  </label>

                  <input
                    id="group-name"
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter group name"
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isCreating}
                  >
                    {isCreating ? 'Creating...' : 'Create Group'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default GroupListPage;