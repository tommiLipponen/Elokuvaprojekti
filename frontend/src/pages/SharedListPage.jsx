import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { getFavoriteListById } from '../services/favoriteApi.js';

function SharedListPage() {
  const { id } = useParams();
  const { accessToken } = useAuth() ?? {};

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    getFavoriteListById(id, accessToken)
      .then((data) => {
        if (cancelled) {
          return;
        }

        if (data?.message) {
          setError(data.message);
          setList(null);
        } else {
          setError('');
          setList(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Failed to load shared favorite list');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, accessToken]);

  if (loading) {
    return (
      <div>
        <h1>Shared List</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !list) {
    return (
      <div>
        <h1>Shared List</h1>
        <p>{error || 'This favorite list is not available.'}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{list.name}</h1>

      {!list.items || list.items.length === 0 ? (
        <p>No movies in this list yet.</p>
      ) : (
        <ul>
          {list.items.map((item) => (
            <li key={item.movieId}>{item.movie?.title ?? item.movieId}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SharedListPage;
