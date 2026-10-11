import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { deleteAccount } from '../services/userApi.js';
import * as groupApi from '../services/groupApi.js';

function UserProfilePage() {
  const { user, accessToken, logout } = useAuth();
  const navigate = useNavigate();

  const [myGroups, setMyGroups] = useState([]);
  const [groupsError, setGroupsError] = useState('');

  useEffect(() => {
    let cancelled = false;

    groupApi
      .getMyGroups(accessToken)
      .then((groups) => {
        if (!cancelled) {
          setMyGroups(groups);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGroupsError('Failed to load your groups');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Delete this group?')) {
      return;
    }

    try {
      await groupApi.deleteGroup(groupId, accessToken);
      setMyGroups((current) => current.filter((group) => group.id !== groupId));
    } catch (error) {
      console.error(error);
      setGroupsError('Failed to delete group');
    }
  };

  const handleLeaveGroup = async (groupId) => {
    if (!window.confirm('Leave this group?')) {
      return;
    }

    try {
      await groupApi.leaveGroup(groupId, accessToken);
      setMyGroups((current) => current.filter((group) => group.id !== groupId));
    } catch (error) {
      console.error(error);
      setGroupsError('Failed to leave group');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and is permanent. Please note that deleting your account will result in the permanent loss of all your data, including any personal information, settings, and content associated with your account. If you are certain about this decision, please confirm to proceed with the deletion process.'
    );

    if (!confirmed) {
      return;
    }

    const confirmedAgain = window.confirm(
      'Please confirm account deletion once more'
    );

    if (!confirmedAgain) {
      return;
    }

    try {
      await deleteAccount(accessToken);
      await logout();
      navigate('/');
    } catch (error) {
      console.error(error);
      window.alert('Failed to delete account.');
    }
  };

  return (
    <main className="container py-5 profile-page">
      <div className="profile-card">
        <div className="profile-user">
          <div className="profile-photo">
            <span>👤</span>
          </div>

          <h3 className="profile-username">{user.username}</h3>
        </div>

        <div className="profile-email">
          <span>{user.email}</span>
        </div>

        <hr />

        <div className="profile-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/favorites')}
          >
            favorites
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={async () => {
              try {
                await logout();
              } finally {
                navigate('/');
              }
            }}
          >
            log out
          </button>
        </div>

        <hr />

        <section className="group-section">
          <div className="group-section-header">
            <h2>my groups</h2>
          </div>

          {groupsError && <p className="group-error">{groupsError}</p>}

          <div className="group-list">
            {myGroups.map((group) => {
              const isOwner = group.ownerId === user.id;

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
                      {isOwner ? 'owner' : 'member'}
                    </span>
                  </div>

                  {isOwner ? (
                    <button
                      type="button"
                      className="btn btn-danger group-button"
                      onClick={() => handleDeleteGroup(group.id)}
                    >
                      delete group
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary group-button"
                      onClick={() => handleLeaveGroup(group.id)}
                    >
                      leave group
                    </button>
                  )}
                </div>
              );
            })}

            {myGroups.length === 0 && (
              <p className="group-empty">You are not in any groups yet.</p>
            )}
          </div>
        </section>

        <hr />

        <section className="profile-delete">       
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDeleteAccount}
          >
            delete account
          </button>
        </section>
      </div>
    </main>
  );
}

export default UserProfilePage;