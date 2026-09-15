import { useState } from 'react';
import { getGroups } from '../services/groupApi.js';

export function useGroups() {
  const [groups, setGroups] = useState([]);

  async function loadGroups() {
    const results = await getGroups();
    setGroups(results);
  }

  return { groups, loadGroups };
}
