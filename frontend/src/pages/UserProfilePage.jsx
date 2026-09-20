import { useAuth } from '../context/useAuth.js';
import { deleteAccount } from '../services/userApi.js';

function UserProfilePage() {
  const { accessToken, logout } = useAuth();

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
  } catch (error) {
    console.error(error);
    window.alert('Failed to delete account.');
  }
};


  return (
    <div>
      <h1>User Profile</h1>

      <button type="button" onClick={handleDeleteAccount}>
        Delete account
      </button>
    </div>
  );
}

export default UserProfilePage;
