const API_BASE = '/api/favorites';

export async function getFavorites(accessToken) {
  const res = await fetch(API_BASE, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.json();
}

export async function createFavoriteList(name, accessToken) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ name }),
  });

  return res.json();
}

export async function getFavoriteListById(listId, accessToken) {
  const res = await fetch(`${API_BASE}/${listId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.json();
}

export async function deleteFavoriteList(listId, accessToken) {
  const res = await fetch(`${API_BASE}/${listId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    return res.json();
  }

  return null;
}

export async function addItemToList(listId, movieId, accessToken) {
  const res = await fetch(`${API_BASE}/${listId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ movieId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to add movie to favorite list');
  }

  return data;
}

export async function removeItemFromList(listId, movieId, accessToken) {
  const res = await fetch(`${API_BASE}/${listId}/items/${movieId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    return res.json();
  }

  return null;
}

export async function updateFavoriteListVisibility(listId, isPublic, accessToken) {
  const res = await fetch(`${API_BASE}/${listId}/public`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ isPublic }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to update favorite list visibility');
  }

  return data;
}