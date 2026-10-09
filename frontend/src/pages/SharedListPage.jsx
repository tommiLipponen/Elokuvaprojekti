import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublicFavoriteLists } from '../services/favoriteApi.js';

function SharedListPage() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    <main className="container py-5 shared-lists-page">
      <h1 className="shared-lists-title">shared lists</h1>

      {loading && (
        <p className="shared-lists-message">
          Loading...
        </p>
      )}

      {error && (
        <p className="shared-lists-message shared-lists-error">
          {error}
        </p>
      )}

      {!loading && !error && lists.length === 0 && (
        <p className="shared-lists-message">
          No public lists yet.
        </p>
      )}

      {!loading && !error && lists.length > 0 && (
        <div className="shared-lists-card">
          {lists.map((list) => (
            <div className="shared-list-row" key={list.id}>
              <div className="shared-list-header">
                <div>
                  <Link
                    to={`/shared-lists/${list.id}`}
                    className="shared-list-link"
                  >
                    <h2 className="shared-list-name">
                      {list.name}
                    </h2>
                  </Link>

                  {list.user?.username && (
                    <p className="shared-list-owner">
                      by {list.user.username}
                    </p>
                  )}
                </div>

                <Link
                  to={`/shared-lists/${list.id}`}
                  className="btn btn-primary shared-list-button"
                >
                  view
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default SharedListPage;
