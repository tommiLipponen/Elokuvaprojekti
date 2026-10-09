import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import * as groupApi from '../services/groupApi.js';

function GroupListPage() {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();

  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [myGroupIds, setMyGroupIds] = useState([]);
  const [requestedGroupIds, setRequestedGroupIds] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
          setError('');
        }

        if (accessToken) {
          const myGroups = await groupApi.getMyGroups(accessToken);

          if (cancelled) return;

          setMyGroupIds(myGroups.map((group) => group.id));
        } else {
          setMyGroupIds([]);
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
      setError('Group name is required.');
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
      setShowCreateModal(false);
    } catch {
      setError('Failed to create group');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRequest = async (groupId) => {
    if (requestedGroupIds.includes(groupId)) return;
    setError('');

    try {
      const result = await groupApi.requestToJoinGroup(groupId, accessToken);

      if (result.message) {
        setError(result.message);
        return;
      }

      setRequestedGroupIds((ids) => [...ids, groupId]);
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
            onClick={() => {
              setError('');
              setShowCreateModal(true);
            }}
          >
            create group
          </button>
        )}
      </div>

      {error && <p className="group-error">{error}</p>}

      <input
        type="text"
        className="form-control group-search"
        placeholder="Search groups..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="group-list">
        {filteredGroups.map((group) => {
          const isMyGroup =
            myGroupIds.includes(group.id) || group.user?.id === user?.id;
          const isRequested = requestedGroupIds.includes(group.id);

          return (
            <div className="group-row" key={group.id}>
              <h2 className="group-name">
                <Link
                  to={`/groups/${group.id}`}
                  className="group-title-link"
                >
                  {group.name}
                </Link>
              </h2>

              <span className="group-members">
                {group.members?.length ?? group.memberCount ?? 0} members
              </span>

              {accessToken && isMyGroup ? (
                <button
                  type="button"
                  className="btn btn-primary group-button"
                  onClick={() => navigate(`/groups/${group.id}`)}
                >
                  open group
                </button>
              ) : accessToken ? (
                <button
                  type="button"
                  className="btn btn-primary group-button"
                  onClick={() => handleJoinRequest(group.id)}
                  disabled={isRequested}
                >
                  {isRequested ? 'Requested' : 'Request to join'}
                </button>
              ) : null}
            </div>
          );
        })}

        {filteredGroups.length === 0 && (
          <p className="group-empty">No groups found.</p>
        )}
      </div>

      {accessToken && showCreateModal && (
        <div className="create-modal-overlay">
          <div
            className="create-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="createGroupModalLabel"
          >
            <div className="create-modal-header">
              <h2 id="createGroupModalLabel">Create a group</h2>

              <button
                type="button"
                className="create-modal-close"
                onClick={() => setShowCreateModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateGroup}>
              <div className="create-modal-body">
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
                  autoFocus
                />
              </div>

              <div className="create-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
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
      )}
    </main>
  );
}

export default GroupListPage;