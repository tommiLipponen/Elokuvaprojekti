import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import * as authApi from '../services/authApi.js';

const AuthContext = createContext(null);

const STORAGE_KEY = 'auth-session';
const REFRESH_MARGIN_MS = 60 * 1000;
const RETRY_DELAY_MS = 15 * 1000;

function getTokenExpiryMs(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(payload));
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return null;
  }
}

function parseSession(value) {
  try {
    const session = JSON.parse(value);
    return session?.refreshToken ? session : null;
  } catch {
    return null;
  }
}

function isAccessTokenValid(token) {
  const expiresAt = token ? getTokenExpiryMs(token) : null;
  return Boolean(expiresAt && expiresAt > Date.now());
}

// An expired access token is dropped on load and renewed with the refresh token
function loadStoredSession() {
  const session = parseSession(localStorage.getItem(STORAGE_KEY));

  if (!session) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }

  return {
    ...session,
    accessToken: isAccessTokenValid(session.accessToken) ? session.accessToken : null,
  };
}

export function AuthProvider({ children }) {
  const [stored] = useState(loadStoredSession);
  const [user, setUser] = useState(stored?.user ?? null);
  const [accessToken, setAccessToken] = useState(stored?.accessToken ?? null);
  const [refreshToken, setRefreshToken] = useState(stored?.refreshToken ?? null);
  const [ready, setReady] = useState(!stored || Boolean(stored.accessToken));
  const inFlightRefresh = useRef(null);

  const applySession = useCallback((session) => {
    setUser(session.user);
    setAccessToken(session.accessToken);
    setRefreshToken(session.refreshToken);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  }, []);

  // Refresh tokens are single-use, so concurrent calls with the same token share one request
  const refreshSession = useCallback((token) => {
    if (inFlightRefresh.current?.token !== token) {
      const promise = authApi.refresh(token);
      inFlightRefresh.current = { token, promise };
    }

    return inFlightRefresh.current.promise;
  }, []);

  useEffect(() => {
    if (!refreshToken) {
      localStorage.removeItem(STORAGE_KEY);
      return undefined;
    }

    if (accessToken) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user, accessToken, refreshToken }),
      );
    }

    let cancelled = false;
    let timer;

    const run = async () => {
      try {
        const response = await refreshSession(refreshToken);

        if (cancelled) {
          return;
        }

        if (response.errors) {
          clearSession();
        } else {
          applySession(response);
        }
        setReady(true);
      } catch {
        // Network error: keep the session and try again
        if (!cancelled) {
          setReady(true);
          timer = setTimeout(run, RETRY_DELAY_MS);
        }
      }
    };

    const expiresAt = accessToken ? getTokenExpiryMs(accessToken) : null;
    const delay = expiresAt
      ? Math.max(expiresAt - REFRESH_MARGIN_MS - Date.now(), 0)
      : 0;

    timer = setTimeout(run, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [user, accessToken, refreshToken, refreshSession, applySession, clearSession]);

  // Keep tabs in sync: a rotated or cleared session in one tab applies to the others
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY) {
        return;
      }

      const session = parseSession(event.newValue);
      if (session) {
        applySession(session);
      } else {
        clearSession();
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [applySession, clearSession]);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);

    if (response.errors) {
      throw new Error(response.errors.message || 'Login failed');
    }

    applySession(response);

    return response;
  };

  const logout = async () => {
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } finally {
      clearSession();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        refreshToken,
        login,
        logout,
      }}
    >
      {ready ? children : null}
    </AuthContext.Provider>
  );
}

export default AuthContext;
