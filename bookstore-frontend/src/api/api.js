import axios from 'axios';
import { jwtDecode as jwt_decode } from 'jwt-decode';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      // Kiểm tra token hết hạn
      try {
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return Promise.reject(new Error('Token expired'));
        }
        
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Token decode error:', error);
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(new Error('Invalid token'));
      }
    }
    return config;
  },
  error => Promise.reject(error)
);
// Thêm interceptor cho response
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token không hợp lệ
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;