import { useAuth } from '../context/useAuth.js';
import { useNavigate } from 'react-router-dom';
import { deleteAccount } from '../services/userApi.js';

function UserProfilePage() {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();

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

          <h3 className="profile-username">username</h3>
        </div>

        <div className="profile-email">
          <span>user@example.com</span>
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
            onClick={() => navigate('/groups')}
          >
            groups
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

        <section className="profile-delete">
          <h2>Delete Account</h2>

          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </section>
      </div>
    </main>
  );
}

export default UserProfilePage;