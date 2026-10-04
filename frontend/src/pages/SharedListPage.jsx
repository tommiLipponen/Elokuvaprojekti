import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublicFavoriteLists } from '../services/favoriteApi.js';

function SharedListPage() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewedId, setViewedId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getPublicFavoriteLists()
      .then((data) => {
        if (!cancelled) {
          setLists(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load shared favorite lists');
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
  }, []);

  return (
    <div>
      <h1>Shared Lists</h1>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && lists.length === 0 && <p>No public lists yet.</p>}

      <ul>
        {lists.map((list) => (
          <li key={list.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0 }}>
                {list.name}
                {list.user?.username && <small> by {list.user.username}</small>}
              </h2>
              <button
                type="button"
                onClick={() => setViewedId((current) => (current === list.id ? null : list.id))}
              >
                {viewedId === list.id ? 'Hide' : 'View'}
              </button>
            </div>

            {viewedId === list.id &&
              (!list.items || list.items.length === 0 ? (
                <p>No movies in this list yet.</p>
              ) : (
                <ul>
                  {list.items.map((item) => (
                    <li key={item.movieId}>
                      <strong>{item.movie?.title ?? item.movieId}</strong>{' '}
                      <Link to={`/movies/${item.movieId}`}>Read reviews</Link>
                      {item.movie?.overview && <p>{item.movie.overview}</p>}
                    </li>
                  ))}
                </ul>
              ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SharedListPage;
