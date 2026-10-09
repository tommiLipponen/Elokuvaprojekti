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

  const favoriteList = lists[0];

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

  const handleRemoveMovie = async (movieId) => {
    try {
      await removeMovie(favoriteList.id, movieId);
    } catch (err) {
      setFormError(err.message || 'Failed to remove movie');
    }
  };

  const handleTogglePublic = async () => {
    if (!favoriteList) {
      return;
    }

    try {
      await updateListVisibility(
        favoriteList.id,
        !favoriteList.isPublic
      );
    } catch (err) {
      setFormError(err.message || 'Failed to update list visibility');
    }
  };

  if (!user) {
    return (
      <main className="container py-5 favorite-list-page">
        <h1 className="favorite-list-title">Favorite Lists</h1>
        <p>Log in to create and manage your favorite lists.</p>
      </main>
    );
  }

  return (
    <main className="container py-5 favorite-list-page">
      <div className="favorite-list-header">
        <h1 className="favorite-list-title">
          {user.username}&apos;s Favorites
        </h1>

        {favoriteList && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleTogglePublic}
          >
            {favoriteList.isPublic ? 'unshare list' : 'share list'}
          </button>
        )}
      </div>

      {formError && (
        <p className="favorite-list-error">{formError}</p>
      )}

      {error && (
        <p className="favorite-list-error">{error}</p>
      )}

      {loading && <p>Loading...</p>}

      {!loading && !favoriteList && (
        <section className="favorite-list-empty">
          <p>You don&apos;t have a favorite list yet.</p>

          <form onSubmit={handleCreateList}>
            <label htmlFor="listName">New list name</label>

            <input
              id="listName"
              type="text"
              className="form-control"
              value={newListName}
              onChange={(event) => setNewListName(event.target.value)}
            />

            <button
              type="submit"
              className="btn btn-primary"
            >
              Create list
            </button>
          </form>
        </section>
      )}

      {!loading && favoriteList && (
        <section className="favorite-list">
          {!favoriteList.items ||
          favoriteList.items.length === 0 ? (
            <p className="favorite-list-empty">
              No movies in your favorites yet.
            </p>
          ) : (
            <div className="favorite-movie-grid">
              {favoriteList.items.map((item) => (
                <div
                  className="favorite-movie"
                  key={item.movieId}
                >
                  {item.movie ? (
                    <MovieCard movie={item.movie} />
                  ) : (
                    <p>{item.movieId}</p>
                  )}

                  <button
                    type="button"
                    className="btn btn-secondary favorite-remove-button"
                    onClick={() =>
                      handleRemoveMovie(item.movieId)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default FavoriteListPage;
