const API_BASE = '/api/groups';

export async function getGroups() {
  const res = await fetch(API_BASE);
  return res.json();
}

export async function getGroupById(groupId, accessToken) {
  const res = await fetch(`${API_BASE}/${groupId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.json();
}

export async function createGroup(name, accessToken) {
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

export async function deleteGroup(groupId, accessToken) {
  const res = await fetch(`${API_BASE}/${groupId}`, {
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