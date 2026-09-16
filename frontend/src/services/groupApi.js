const API_BASE = '/api/groups';

export async function getGroups() {
  const res = await fetch(API_BASE);
  return res.json();
}
