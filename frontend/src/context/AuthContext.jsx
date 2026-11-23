import { createContext, useContext, useState } from 'react';
import { logoutApi } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pixelvault_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('pixelvault_token') || null;
  });

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('pixelvault_user', JSON.stringify(userData));
    localStorage.setItem('pixelvault_token', jwtToken);
  };

const logout = async () => {
  if (token) {
    await logoutApi();
  }
  setUser(null);
  setToken(null);
  localStorage.removeItem('pixelvault_user');
  localStorage.removeItem('pixelvault_token');
};

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}