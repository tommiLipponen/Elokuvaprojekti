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
  const [joinRequests, setJoinRequests] = useState({});
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
          const [myGroups, myRequests] = await Promise.all([
            groupApi.getMyGroups(accessToken),
            groupApi.getMyJoinRequests(accessToken),
          ]);

          if (cancelled) return;

          setMyGroupIds(myGroups.map((group) => group.id));
          setJoinRequests(
            Object.fromEntries(
              myRequests.map((request) => [request.groupId, request.status])
            )
          );
        } else {
          setMyGroupIds([]);
          setJoinRequests({});
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
    if (joinRequests[groupId] === 'PENDING') return;
    setError('');

    try {
      const result = await groupApi.requestToJoinGroup(groupId, accessToken);

      if (result.message) {
        setError(result.message);
        return;
      }

      setJoinRequests((current) => ({ ...current, [groupId]: 'PENDING' }));
    } catch {
      setError('Failed to send join request');
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!hasLoaded) {
    return (
      <div className="py-5 group-page">
        <p>Loading groups...</p>
      </div>
    );
  }

  return (
    <div className="py-5 group-page">
      <div className="list-page-header">
        <h1 className="group-title">groups</h1>

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


      <form
        className="list-page-search"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          className="group-search-input"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="search groups..."
        />
      </form>


      <div className="group-list">
        {filteredGroups.map((group) => {
          const isMyGroup =
            myGroupIds.includes(group.id) || group.user?.id === user?.id;
          const requestStatus = joinRequests[group.id];
          const isRequested = requestStatus === 'PENDING';
          const isRejected = requestStatus === 'REJECTED';

          return (
            <div className="list-page-row" key={group.id}>
              <div className="group-info">
                <h2 className="list-page-name">
                  <Link
                    to={`/groups/${group.id}`}
                    className="list-page-title-link"
                  >
                    {group.name}
                  </Link>
                </h2>

                <span className="group-members">
                  {group.members?.length ?? group.memberCount ?? 0} members
                </span>

                {accessToken && !isMyGroup && isRequested && (
                  <span className="group-request-status group-request-pending">
                    request sent, waiting for the owner to respond
                  </span>
                )}

                {accessToken && !isMyGroup && isRejected && (
                  <span className="group-request-status group-request-rejected">
                    your request was declined
                  </span>
                )}
              </div>

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
                  className="btn group-button btn-primary"
                  onClick={() => handleJoinRequest(group.id)}
                  disabled={isRequested}
                >
                  {isRequested
                    ? 'requested'
                    : isRejected
                      ? 'request again'
                      : 'request to join'}
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
        <div
          className="modal d-block create-list-modal"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          aria-labelledby="createGroupModalLabel"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content create-list-modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-4" id="createGroupModalLabel">
                  create a group
                </h2>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                  aria-label="Close"
                />
              </div>

              <form onSubmit={handleCreateGroup} className="create-list-form">
                <div className="modal-body">
                  <input
                    id="group-name"
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="group name"
                    autoFocus
                  />
                </div>

                <div className="modal-footer">

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isCreating}
                  >
                    {isCreating ? 'Creating...' : 'create Group'}
                  </button>
                  
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupListPage;