const API_BASE = '/api/groups';

export async function getGroups() {
  const res = await fetch(API_BASE);
  return res.json();
}

export async function getMyGroups(accessToken) {
  const res = await fetch(`${API_BASE}/mine`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to get your groups');
  }

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

export async function addMovieToGroup(groupId, movieId, accessToken) {

  const res = await fetch(`${API_BASE}/${groupId}/movies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ movieId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to add movie to group');
  }

  return data;
}
export async function requestToJoinGroup(groupId, accessToken) {
  const res = await fetch(`${API_BASE}/${groupId}/join-requests`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  return res.json();
}

export async function getJoinRequests(groupId, accessToken) {
  const res = await fetch(`${API_BASE}/${groupId}/join-requests`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.json();
}

export async function updateJoinRequest(
  groupId,
  userId,
  status,
  accessToken
) {
  const res = await fetch(
    `${API_BASE}/${groupId}/join-requests/${userId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  return res.json();
}