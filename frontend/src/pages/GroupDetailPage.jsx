import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import * as groupApi from '../services/groupApi.js';

function GroupDetailPage() {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const [group, setGroup] = useState(null);
  const [error, setError] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadGroup() {
      const result = await groupApi.getGroupById(id, accessToken);
      if (cancelled) return;

      if (result.message) {
        setError(result.message);
      } else {
        setGroup(result);
      }
      setHasLoaded(true);
    }

    loadGroup();

    return () => {
      cancelled = true;
    };
  }, [id, accessToken]);

  if (!hasLoaded) return <p>Loading group...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{group.name}</h1>
      <p>Owner ID: {group.ownerId}</p>
      <p>Created: {new Date(group.createdAt).toLocaleDateString()}</p>
    </div>
  );
}

export default GroupDetailPage;