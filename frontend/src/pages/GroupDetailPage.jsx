import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import * as groupApi from '../services/groupApi.js';

function GroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();

  const [group, setGroup] = useState(null);
  const [error, setError] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadGroup() {
      try {
        const result = await groupApi.getGroupById(id, accessToken);

        if (cancelled) return;

        if (result.message) {
          setError(result.message);
        } else {
          setGroup(result);
        }

        setHasLoaded(true);
      } catch {
        if (!cancelled) {
          setError('Failed to load group');
          setHasLoaded(true);
        }
      }
    }

    loadGroup();

    return () => {
      cancelled = true;
    };
  }, [id, accessToken]);

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

  if (!hasLoaded) {
    return <p>Loading group...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const isOwner = group.ownerId === user?.id;

  return (
    <div>
      <h1>{group.name}</h1>

      <p>Owner ID: {group.ownerId}</p>

      <p>
        Created: {new Date(group.createdAt).toLocaleDateString()}
      </p>

      {isOwner && (
        <button onClick={handleDelete}>
          Delete group
        </button>
      )}

      {deleteError && <p>{deleteError}</p>}
    </div>
  );
}

export default GroupDetailPage;