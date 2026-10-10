import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth.js';
import { useFavorites } from '../hooks/useFavorites.js';
import MovieCard from '../components/MovieCard.jsx';
import './FavoriteListPage.css';

function FavoriteListPage() {
  const { user } = useAuth() ?? {};

  const {
    lists,
    loading,
    error,
    loadLists,
    addList,
    removeMovie,
    removeList,
    updateListVisibility,
  } = useFavorites();

  const [newListName, setNewListName] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (user) {
      loadLists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCreateList = async (event) => {
    event.preventDefault();
    setFormError('');

    const name = newListName.trim();

    if (!name) {
      setFormError('List name is required');
      return;
    }

    try {
      await addList(name);
      setNewListName('');
    } catch (err) {
      setFormError(err.message || 'Failed to create favorite list');
    }
  };

  const handleRemoveMovie = async (listId, movieId) => {
    setFormError('');

    try {
      await removeMovie(listId, movieId);
    } catch (err) {
      setFormError(err.message || 'Failed to remove movie');
    }
  };

  const handleDeleteList = async (listId) => {
    if (!window.confirm('Delete this favorite list?')) {
      return;
    }

    setFormError('');

    try {
      await removeList(listId);
    } catch (err) {
      setFormError(err.message || 'Failed to delete favorite list');
    }
  };

  const handleTogglePublic = async (list) => {
    setFormError('');

    try {
      await updateListVisibility(list.id, !list.isPublic);
    } catch (err) {
      setFormError(err.message || 'Failed to update list visibility');
    }
  };

  if (!user) {
    return (
      <main className="container py-5 favorite-list-page">
        <h1 className="favorite-list-title">favorite lists</h1>

        <p className="text-muted">
          Log in to create and manage your favorite lists.
        </p>
      </main>
    );
  }

  return (
    <main className="container py-5 favorite-list-page">
      <header className="favorite-list-header">
        <h1 className="favorite-list-title">
          {user.username
            ? `${user.username}'s Favorite Lists`
            : 'Favorite Lists'}
        </h1>
      </header>

      {formError && (
        <p className="favorite-list-error" role="alert">
          {formError}
        </p>
      )}

      {error && (
        <p className="favorite-list-error" role="alert">
          {error}
        </p>
      )}

      <section className="favorite-list-create mb-5">
        <h2 className="h4 mb-3">Create a new list</h2>

        <form onSubmit={handleCreateList}>
          <div className="mb-3">
            <label htmlFor="listName" className="form-label">
              New list name
            </label>

            <input
              id="listName"
              type="text"
              className="form-control"
              value={newListName}
              onChange={(event) => setNewListName(event.target.value)}
              placeholder="Enter list name"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            create list
          </button>
        </form>
      </section>

      {loading && (
        <p className="text-muted" role="status">
          Loading favorite lists...
        </p>
      )}

      {!loading && lists.length === 0 && (
        <section className="favorite-list-empty">
          <p>You don't have any favorite lists yet.</p>
        </section>
      )}

      {!loading && lists.length > 0 && (
        <div className="favorite-lists">
          {lists.map((list) => (
            <section className="favorite-list" key={list.id}>
              <div className="favorite-list-header">
                <h2 className="favorite-list-title">
                  {list.name}
                </h2>

                <div className="favorite-list-settings">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => handleTogglePublic(list)}
                    disabled={loading}
                  >
                    {list.isPublic ? 'Make private' : 'Make public'}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => handleDeleteList(list.id)}
                    disabled={loading}
                  >
                    delete list
                  </button>
                </div>
              </div>

              <p className="text-muted small">
                Visibility:{' '}
                <span className="fw-semibold">
                  {list.isPublic ? 'Public' : 'Private'}
                </span>
              </p>

              {!list.items || list.items.length === 0 ? (
                <p className="favorite-list-empty">
                  No movies in this list yet.
                </p>
              ) : (
                <div className="favorite-movie-grid">
                  {list.items.map((item) => (
                    <div
                      className="favorite-movie"
                      key={item.movieId}
                    >
                      {item.movie ? (
                        <MovieCard movie={item.movie} />
                      ) : (
                        <p>Movie ID: {item.movieId}</p>
                      )}

                      <button
                        type="button"
                        className="btn btn-outline-danger favorite-remove-button"
                        onClick={() =>
                          handleRemoveMovie(list.id, item.movieId)
                        }
                        disabled={loading}
                      >
                        Remove movie
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

export default FavoriteListPage;