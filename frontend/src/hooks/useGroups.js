import { useState } from 'react';
import { useAuth } from '../context/useAuth.js';
import * as groupApi from '../services/groupApi.js';

export function useGroups() {
  const { accessToken } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadGroups() {
    setLoading(true);
    setError('');

    try {
      const results = await groupApi.getGroups();
      setGroups(results);
    } catch {
      setError('Failed to load groups.');
    } finally {
      setLoading(false);
    }
  }

  async function addGroup(name) {
    const group = await groupApi.createGroup(name, accessToken);
    if (group.message) {
      throw new Error(group.message);
    }

    setGroups((current) => [group, ...current]);
    return group;
  }

  return { groups, loading, error, loadGroups, addGroup };
} 