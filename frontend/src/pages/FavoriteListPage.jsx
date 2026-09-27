import { useState } from 'react';
import { useAuth } from '../context/useAuth.js';

function FavoriteListPage() {
  const { user } = useAuth() ?? {};

  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [error, setError] = useState('');

  const handleCreateList = (event) => {
    event.preventDefault();
    setError('');

    const name = newListName.trim();
    if (!name) {
      setError('List name is required');
      return;
    }

    setLists((current) => [
      { id: `local-${Date.now()}`, name, items: [] },
      ...current,
    ]);
    setNewListName('');
  };

  const handleRemoveMovie = (listId, movieId) => {
    setLists((current) =>
      current.map((list) =>
        list.id === listId
          ? { ...list, items: list.items.filter((item) => item.movieId !== movieId) }
          : list
      )
    );
  };

  if (!user) {
    return (
      <div>
        <h1>Favorite Lists</h1>
        <p>Log in to create and manage your favorite lists.</p>
      </div>
    );
  }

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
      {error && <p>{error}</p>}

      {lists.length === 0 ? (
        <p>You don&apos;t have any favorite lists yet.</p>
      ) : (
        <ul>
          {lists.map((list) => (
            <li key={list.id}>
              <h2>{list.name}</h2>
              {list.items.length === 0 ? (
                <p>No movies in this list yet.</p>
              ) : (
                <ul>
                  {list.items.map((item) => (
                    <li key={item.movieId}>
                      {item.title}
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
