import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import * as groupApi from '../services/groupApi.js';
import MovieCard from '../components/MovieCard.jsx';

function GroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();

  // useState → lets a component remember information between renders,
  // const [current value, function to update the value] = useState(initial value);
  const [group, setGroup] = useState(null);
  const [error, setError] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinMessage, setJoinMessage] = useState('');
  const [joinRequests, setJoinRequests] = useState([]);
  const [joinRequestsError, setJoinRequestsError] = useState('');
  const [membersError, setMembersError] = useState('');

  // useEffect → runs code when the component loads or when specified values change,
  // useEffect(() => {...}, [dependencies]);
  useEffect(() => {
    // prevents the response from being used if the component is no longer active
    let cancelled = false;

    // async → allows the function to wait for asynchronous operations
    // await → waits for the server response before continuing
    async function loadGroup() {
      try {
        // sends a request and waits for the group data
        const result = await groupApi.getGroupById(id, accessToken);

        // stops if the request was cancelled
        if (cancelled) return;

        // checks if the server returned an error message
        if (result.message) {
          setError(result.message);
        } else {
          // saves the group data to the state
          setGroup(result);
        }

        // marks that the loading has finished
        setHasLoaded(true);
      } catch {
        // handles errors that occur while loading the group
        if (!cancelled) {
          setError('Failed to load group');
          setHasLoaded(true);
        }
      }
    }

    // calls the function to load the group
    loadGroup();

    // cleanup function → runs when the component is removed or before the effect runs again
    return () => {
      cancelled = true;
    };
  }, [id, accessToken]);

  // Check if the currently logged-in user is the owner of the group
  const isOwner = group?.ownerId === user?.id;

  // Check if the currently logged-in user is an approved member of the group
  const isMember =
    isOwner ||
    group?.memberships?.some(
      (membership) =>
        membership.userId === user?.id &&
        membership.status === 'APPROVED'
    );

  useEffect(() => {
    // returns if there is no group or the user is not the group owner
    if (!group || !isOwner) {
      return;
    }

    let cancelled = false;

    async function loadJoinRequests() {
      try {
        const result = await groupApi.getJoinRequests(id, accessToken);

        if (cancelled) return;

        if (result?.message) {
          setJoinRequestsError(result.message);
          return;
        }

        setJoinRequests(result);
      } catch {
        if (!cancelled) {
          setJoinRequestsError('Failed to load join requests');
        }
      }
    }

    loadJoinRequests();

    return () => {
      cancelled = true;
    };
  }, [group, id, accessToken, isOwner]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this group? This cannot be undone.')) {
      return;
    }

    setDeleteError('');

    const result = await groupApi.deleteGroup(id, accessToken);

    if (result?.message) {
      setDeleteError(result.message);
      return;
    }

    navigate('/groups');
  };

  const handleJoinRequest = async () => {
    setJoinError('');
    setJoinMessage('');

    const result = await groupApi.requestToJoinGroup(
      id,
      accessToken
    );

    if (result?.message) {
      setJoinError(result.message);
      return;
    }

    setJoinMessage('Join request sent!');
  };

  const handleJoinRequestUpdate = async (userId, status) => {
    setJoinRequestsError('');

    const result = await groupApi.updateJoinRequest(
      id,
      userId,
      status,
      accessToken
    );

    if (result?.message && !result?.status) {
      setJoinRequestsError(result.message);
      return;
    }

    // .filter(...) → creates a new array containing all requests except the updated request
    setJoinRequests((currentRequests) =>
      currentRequests.filter(
        (request) => request.userId !== userId
      )
    );
  };

  const handleRemoveMember = async (userId) => {
    setMembersError('');

    const result = await groupApi.removeGroupMember(
      id,
      userId,
      accessToken
    );

    if (result?.message) {
      setMembersError(result.message);
      return;
    }

    // updates the group state by removing the member from the memberships array
    // ...currentGroup → keeps all other group information unchanged
    // .filter(...) → creates a new array containing all memberships except the removed member
    setGroup((currentGroup) => ({
      ...currentGroup,
      memberships: currentGroup.memberships.filter(
        (membership) => membership.userId !== userId
      ),
    }));
  };

  const handleLeaveGroup = async () => {
    // clears any previous error message
    setMembersError('');

    // sends a request to the server to leave the group
    const result = await groupApi.leaveGroup(id, accessToken);

    // checks if the server returned an error message
    if (result?.message) {
      setMembersError(result.message);
      return;
    }

    // navigates back to the groups page
    navigate('/groups');
  };

  if (!hasLoaded) {
    return <p>Loading group...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Check if the group has any approved members.
  const approvedMembers =
    group.memberships?.filter(
      (membership) => membership.status === 'APPROVED'
    ) ?? [];

  const memberCount = approvedMembers.length;

  return (
    <main className="container py-5 group-detail-page">
      <div className="group-detail-header">
        <div>
          <h1 className="group-detail-title">
            {group.name}
          </h1>

          <p className="group-member-count">
            {memberCount} members
          </p>
        </div>
      </div>

      {!isMember ? (
        <section className="group-private">
          <p>This group is private.</p>

          {accessToken && (
            <>
              <button
                  type="button"
                  className="btn group-button btn-primary"
                  onClick={() => handleJoinRequest(group.id)}
                  disabled={isRequested}
                >
                  {isRequested ? 'requested' : 'request to join'}
                </button>

              {joinMessage && <p>{joinMessage}</p>}
              {joinError && <p>{joinError}</p>}
            </>
          )}
        </section>
      ) : (
        <>
          <section id="group-movies" className="group-section">
            <div className="group-section-header">
              <h2>Movies</h2>
            </div>

            {/* Check if the group has any movies. */}
            {group.groupMovies?.length > 0 ? (
              <div className="group-movies">
                {group.groupMovies.map((groupMovie) => (
                  <MovieCard
                    key={groupMovie.id}
                    movie={groupMovie.movie}
                  />
                ))}
              </div>
            ) : (
              <p>No movies in this group yet.</p>
            )}
          </section>

          <section id="group-members" className="group-section">
            <div className="group-section-header">
              <h2>Members</h2>
            </div>

            {membersError && <p>{membersError}</p>}

            {/* Filter the memberships to only include approved members
                and display them in the list. */}
            <div className="group-members-list">
              {approvedMembers.map((membership) => (
                <div
                  className="group-member"
                  key={membership.id}
                >
                  <span>
                    {membership.user?.username || membership.userId}
                  </span>

                  {/* If the current user is the group owner and the member is not
                      the owner, display a button to remove the member. */}
                  {isOwner &&
                    membership.userId !== group.ownerId && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                          handleRemoveMember(membership.userId)
                        }
                      >
                        remove
                      </button>
                    )}
                </div>
              ))}
            </div>

            {/* If the current user is not the group owner, display a button
                that allows the user to leave the group. */}
            {!isOwner && (
              <button
                type="button"
                className="btn btn-primary group-leave-button"
                onClick={handleLeaveGroup}
              >
                leave group
              </button>
            )}
          </section>

          {isOwner && (
            <section id="group-settings" className="group-section">
              {joinRequestsError && (
                <p>{joinRequestsError}</p>
              )}

              <h3>Join Requests</h3>

              {/* If there are no pending join requests, display a message.
                  Otherwise, display all pending join requests as a list. */}
              {joinRequests.length === 0 ? (
                <p>No pending join requests.</p>
              ) : (
                <div className="group-join-requests">
                  {joinRequests.map((request) => (
                    <div
                      className="group-join-request"
                      key={request.id}
                    >
                      <span>
                        {/* Show the username if available, otherwise show the user ID */}
                        {request.user?.username || request.userId}
                      </span>

                      <div>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() =>
                            handleJoinRequestUpdate(
                              request.userId,
                              'APPROVED'
                            )
                          }
                        >
                          approve
                        </button>

                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() =>
                            handleJoinRequestUpdate(
                              request.userId,
                              'REJECTED'
                            )
                          }
                        >
                          reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {deleteError && <p>{deleteError}</p>}

              {isOwner && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  delete group
                </button>
              )}
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default GroupDetailPage;