const API_BASE = '/auth';

export async function login(credentials) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return res.json();
}

export async function register(data) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function logout(refreshToken) {
  const res = await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (res.status === 204) {
    return;
  }
  return res.json();
}
