import React, { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (token exists)
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token by calling a dummy protected route like /api/user/profile
          const response = await axiosClient.get('/api/user/profile');
          setUser({ username: response.data.replace('Merhaba, ', '') }); // hacky way to extract username from "Merhaba, {username}"
        } catch (error) {
          console.error("Token invalid or expired", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    const response = await axiosClient.post('/api/auth/login', { username, password });
    // The backend returns { token, refreshToken, username, message }
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      setUser({ username });
      return true;
    }
    return false;
  };

  const register = async (username, password, email) => {
    const response = await axiosClient.post('/api/auth/register', { username, password, email });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
