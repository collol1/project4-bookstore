// wrapper cho route cần auth
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ roles }) {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return <div>Đang tải thông tin người dùng...</div>; // ✅ tránh redirect sớm
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return <Outlet />;
}