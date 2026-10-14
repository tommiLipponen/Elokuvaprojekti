import { afterEach, describe, expect, it, vi } from 'vitest';
import { login, register, refresh, logout } from '../src/services/authApi.js';

function mockFetchOnce(body, { status = 200 } = {}) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  }));
}

describe('authApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('login returns the session payload on success', async () => {
    mockFetchOnce({ accessToken: 'a', refreshToken: 'b', user: { id: '1' } });

    const result = await login({ email: 'a@b.com', password: 'secret' });

    expect(result.accessToken).toBe('a');
    expect(fetch).toHaveBeenCalledWith(
      '/auth/login',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('login returns the error body on invalid credentials', async () => {
    mockFetchOnce({ message: 'Invalid email or password' }, { status: 401 });

    const result = await login({ email: 'a@b.com', password: 'wrong' });

    expect(result.message).toBe('Invalid email or password');
  });

  it('register returns the created user on success', async () => {
    mockFetchOnce({ id: '1', username: 'new-user' }, { status: 201 });

    const result = await register({ username: 'new-user', email: 'a@b.com', password: 'secret' });

    expect(result.username).toBe('new-user');
  });

  it('register returns the error body when the email is already taken', async () => {
    mockFetchOnce({ message: 'Email already in use' }, { status: 409 });

    const result = await register({ username: 'dup', email: 'a@b.com', password: 'secret' });

    expect(result.message).toBe('Email already in use');
  });

  it('refresh returns a new access token on success', async () => {
    mockFetchOnce({ accessToken: 'new-token' });

    const result = await refresh('old-refresh-token');

    expect(result.accessToken).toBe('new-token');
  });

  it('logout resolves without a body on 204', async () => {
    mockFetchOnce(null, { status: 204 });

    const result = await logout('refresh-token');

    expect(result).toBeUndefined();
  });

  it('logout returns the error body when the refresh token is invalid', async () => {
    mockFetchOnce({ message: 'Invalid refresh token' }, { status: 401 });

    const result = await logout('bad-token');

    expect(result.message).toBe('Invalid refresh token');
  });
});
