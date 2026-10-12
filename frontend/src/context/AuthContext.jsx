import { createContext, useEffect, useState } from 'react';
import * as authApi from '../services/authApi.js';

const AuthContext = createContext(null);

const STORAGE_KEY = 'auth-session';

function getTokenExpiryMs(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(payload));
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return null;
  }
}

function loadStoredSession() {
  try {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const expiresAt = session?.accessToken && getTokenExpiryMs(session.accessToken);

    if (expiresAt && expiresAt > Date.now()) {
      return session;
    }
  } catch {
    // corrupted storage is treated as no session
  }

  localStorage.removeItem(STORAGE_KEY);
  return null;
}

export function AuthProvider({ children }) {
  const [stored] = useState(loadStoredSession);
  const [user, setUser] = useState(stored?.user ?? null);
  const [accessToken, setAccessToken] = useState(stored?.accessToken ?? null);
  const [refreshToken, setRefreshToken] = useState(stored?.refreshToken ?? null);

  const clearSession = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  useEffect(() => {
    if (!accessToken) {
      localStorage.removeItem(STORAGE_KEY);
      return undefined;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user, accessToken, refreshToken }),
    );

    // No refresh endpoint exists yet, so end the session when the access token expires
    const expiresAt = getTokenExpiryMs(accessToken);
    if (!expiresAt) {
      return undefined;
    }

    const timer = setTimeout(clearSession, Math.max(expiresAt - Date.now(), 0));
    return () => clearTimeout(timer);
  }, [user, accessToken, refreshToken]);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);

    if (response.errors) {
      throw new Error(response.errors.message || 'Login failed');
    }

    setUser(response.user);
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);

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
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
