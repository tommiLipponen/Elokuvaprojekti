const API_BASE = '/groups';

export async function getGroups() {
  const res = await fetch(API_BASE);
  return res.json();
}

export async function getGroupById(id, accessToken) {
  const res = await fetch(`${API_BASE}/${id}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  return res.json();
}

export async function createGroup(name, accessToken) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ name })
  });
  return res.json();
}
