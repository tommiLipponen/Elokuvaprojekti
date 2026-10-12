import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth.js';
import { useFavorites } from '../hooks/useFavorites.js';
import MovieCard from '../components/MovieCard.jsx';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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

    setIsCreating(true);

    try {
      await addList(name);
      setNewListName('');
      setShowCreateModal(false);
    } catch (err) {
      setFormError(err.message || 'Failed to create favorite list');
    } finally {
      setIsCreating(false);
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
            ? `${user.username}'s favorite lists`
            : 'favorite lists'}
        </h1>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setFormError('');
            setShowCreateModal(true);
          }}
        >
          create list
        </button>
      </header>

      {formError && !showCreateModal && (
        <p className="favorite-list-error" role="alert">
          {formError}
        </p>
      )}

      {error && (
        <p className="favorite-list-error" role="alert">
          {error}
        </p>
      )}

      {showCreateModal && (
        <div
          className="modal d-block create-list-modal"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          aria-labelledby="createFavoriteListModalLabel"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content create-list-modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-4" id="createFavoriteListModalLabel">
                  create a list
                </h2>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setFormError('');
                    setShowCreateModal(false);
                  }}
                  aria-label="Close"
                />
              </div>

              <form onSubmit={handleCreateList} className="create-list-form">
                <div className="modal-body">
                  <input
                    id="favorite-list-name"
                    type="text"
                    className="form-control"
                    value={newListName}
                    onChange={(event) => setNewListName(event.target.value)}
                    placeholder="list name"
                    aria-label="List name"
                    autoFocus
                  />
                </div>

                {formError && (
                  <p className="favorite-list-error text-center" role="alert">
                    {formError}
                  </p>
                )}

                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isCreating}
                  >
                    {isCreating ? 'Creating...' : 'create list'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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