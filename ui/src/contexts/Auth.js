import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [apiClient, setApiClient] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      // Uncomment the following line if you want to set up the API client on initial load
      // setApiClient(createApi(null, storedToken));
    } else {
      setApiClient(null);
    }
  }, []);

  const login = (userData, authToken) => {
    localStorage.setItem('authToken', authToken);
    setToken(authToken);
    setUser(userData);
    // Uncomment the following line if you want to set up the API client on login
    // setApiClient(createApi(null, authToken));
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
    setApiClient(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, apiClient }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
