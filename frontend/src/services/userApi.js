const API_BASE = '/users';

export async function deleteAccount(accessToken) {
  const res = await fetch(`${API_BASE}/me`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete account');
  }
}
