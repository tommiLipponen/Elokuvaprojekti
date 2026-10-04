import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth.js';
import { useFavorites } from '../hooks/useFavorites.js';

function FavoriteListPage() {
  const { user } = useAuth() ?? {};
  const { lists, loading, error, loadLists, addList, removeMovie, removeList, updateListVisibility } = useFavorites();

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

    try {
      await removeList(listId);
    } catch (err) {
      setFormError(err.message || 'Failed to delete favorite list');
    }
  };

  if (!user) {
    return (
      <div>
        <h1>Favorite Lists</h1>
        <p>Log in to create and manage your favorite lists.</p>
      </div>
    );
  }

const handleTogglePublic = async (list) => {
  try {
    await updateListVisibility(list.id, !list.isPublic);
  } catch (err) {
    setFormError(err.message || 'Failed to update list visibility');
  }
};


  return (
    <div>
      <h1>Favorite Lists</h1>

      <form onSubmit={handleCreateList}>
        <label htmlFor="listName">New list name</label>
        <input
          id="listName"
          type="text"
          value={newListName}
          onChange={(event) => setNewListName(event.target.value)}
        />
        <button type="submit">Create list</button>
      </form>
      {formError && <p>{formError}</p>}
      {error && <p>{error}</p>}

      {loading && <p>Loading...</p>}

      {!loading && lists.length === 0 ? (
        <p>You don&apos;t have any favorite lists yet.</p>
      ) : (
        <ul>
          {lists.map((list) => (
            <li key={list.id}>
              <h2>{list.name}</h2>

              <button
                type="button"
                onClick={() => handleTogglePublic(list)}
              >
                {list.isPublic ? 'Share' : 'Make public'}
              </button>

              <button
                type="button"
                onClick={() => handleDeleteList(list.id)}
              >
                Delete list
              </button>

              {list.isPublic && (
                <p>
                  Share link:{' '}
                  <a href={`/favorite-lists/${list.id}`}>
                    /favorite-lists/{list.id}
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}/favorite-lists/${list.id}`
                      )
                    }
                  >
                    Copy
                  </button>
                </p>
              )}



              {!list.items || list.items.length === 0 ? (
                <p>No movies in this list yet.</p>
              ) : (
                <ul>
                  {list.items.map((item) => (
                    <li key={item.movieId}>
                      {item.movie?.title ?? item.movieId}
                      <button
                        type="button"
                        onClick={() => handleRemoveMovie(list.id, item.movieId)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FavoriteListPage;
