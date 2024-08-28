import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const isTokenExpired = useCallback((token) => {
    if (!token) return true;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }, []);

  const login = useCallback((userData, authToken) => {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setToken(null);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      // Implement your token refresh logic here
      const response = await fetch(
        'https://auth-service-razsp32k5q-uc.a.run.app/refresh',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error('Token refresh failed');
      const data = await response.json();
      login(data.user, data.token);
      return data.token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return null;
    }
  }, [token, login, logout]);

  const getValidToken = useCallback(async () => {
    if (!token) return null;
    if (isTokenExpired(token)) {
      return await refreshToken();
    }
    return token;
  }, [token, isTokenExpired, refreshToken]);

  // Initialize token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      // You might want to set the user here as well, if you have that information
    }
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [isTokenExpired]);

  const value = useMemo(
    () => ({ user, token, login, logout, getValidToken }),
    [user, token, login, logout, getValidToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
