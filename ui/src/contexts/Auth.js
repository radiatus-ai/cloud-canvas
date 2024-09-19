import { jwtDecode } from 'jwt-decode';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getSecureCookie,
  removeSecureCookie,
  setSecureCookie,
} from '../utils/secureStorage';

const AuthContext = createContext();

const TOKEN_EXPIRY_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const isTokenExpired = useCallback((token) => {
    if (!token) return true;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now() + TOKEN_EXPIRY_THRESHOLD;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }, []);

  const login = useCallback((userData, authToken) => {
    setSecureCookie('authToken', authToken);
    setSecureCookie('userData', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    removeSecureCookie('authToken');
    removeSecureCookie('userData');
    setUser(null);
    setToken(null);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const currentToken = getSecureCookie('authToken');
      if (!currentToken) throw new Error('No token available for refresh');

      const response = await fetch('https://auth.dev.r7ai.net/refresh', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for including cookies in the request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Token refresh failed');
      }

      const data = await response.json();
      login(data.user, data.token);
      return data.token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return null;
    }
  }, [login, logout]);

  const getValidToken = useCallback(async () => {
    const currentToken = getSecureCookie('authToken');
    if (!currentToken) return null;
    if (isTokenExpired(currentToken)) {
      return await refreshToken();
    }
    return currentToken;
  }, [isTokenExpired, refreshToken]);

  // Initialize token from secure storage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getSecureCookie('authToken');
      if (storedToken && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        const storedUser = getSecureCookie('userData');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error('Error parsing stored user data:', error);
            logout(); // Clear potentially corrupted data
          }
        }
      } else if (storedToken) {
        // Token exists but is expired, attempt to refresh
        await refreshToken();
      }
    };

    initializeAuth();
  }, [isTokenExpired, refreshToken, logout]);

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
