import { createContext, useState } from 'react';
import * as authApi from '../services/authApi.js';

const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);

    if (response.errors) {
      throw new Error(response.errors.message || 'Login failed');
    }

    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);

    return response;
  };

  const logout = async () => {
    if (refreshToken) {
      await authApi.logout(refreshToken);
    }

    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
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
