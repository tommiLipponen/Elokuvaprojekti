import { afterEach, describe, expect, it, vi } from 'vitest';
import { getGroupById, createGroup, getMyGroups } from './groupApi.js';

function mockFetchOnce(body, { status = 200 } = {}) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  }));
}

describe('groupApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('getGroupById resolves with the group on success', async () => {
    mockFetchOnce({ id: 'g1', name: 'Friday Movie Club' });

    const result = await getGroupById('g1', 'token');

    expect(result.name).toBe('Friday Movie Club');
  });

  it('getGroupById throws instead of returning the error body for an unauthenticated request', async () => {
    mockFetchOnce({ error: 'Access token required' }, { status: 401 });

    await expect(getGroupById('g1', undefined)).rejects.toThrow('Failed to load group');
  });

  it('createGroup resolves with the created group on success', async () => {
    mockFetchOnce({ id: 'g1', name: 'New Group' }, { status: 201 });

    const result = await createGroup('New Group', 'token');

    expect(result.name).toBe('New Group');
  });

  it('getMyGroups throws when the access token is invalid', async () => {
    mockFetchOnce({ error: 'Invalid or expired access token' }, { status: 401 });

    await expect(getMyGroups('bad-token')).rejects.toThrow('Failed to get your groups');
  });
});
