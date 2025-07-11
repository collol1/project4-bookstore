// lưu token, thông tin user/role
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import api from '../api/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      
      // Thêm điều hướng dựa trên role
      if (res.data.user.role === 'admin') {
        window.location.href = '/admin'; // Chuyển đến trang admin
      } else {
        window.location.href = '/'; // Chuyển đến trang chủ user
      }
    } catch (err) {
      console.error('Login failed', err.response?.data || err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

 useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    setIsLoading(false);
    return;
  }

  try {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {
      localStorage.removeItem('token');
      setUser(null);
      setIsLoading(false);
      return;
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    api.get('/auth/me')
      .then(res => {
        setUser(res.data.data);
      })
      .catch(err => {
        console.error('Failed to fetch user', err);
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  } catch (decodeError) {
    console.error('Token decode error:', decodeError);
    localStorage.removeItem('token');
    setUser(null);
    setIsLoading(false);
  }
}, []);
// Thêm hàm đăng ký
  const register = async (username, email, password) => {
    try {
      const res = await api.post('/auth/register', { username, email, password, role: 'user' }); // Chỉ đăng ký role user
      return res.data;
    } catch (err) {
      console.error('Registration failed', err.response?.data || err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, register }}>
      {children}
    </AuthContext.Provider>
  );

  
} 