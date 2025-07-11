import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div className='homepage'>
      <div style={{ maxWidth: 600, margin: '50px auto', background: '#fff', padding: 20, borderRadius: 8 }}>
        <h2>Thông tin cá nhân</h2>
        <div style={{ marginBottom: 15 }}>
          <strong>Tên đăng nhập:</strong> {user.username}
        </div>
        <div style={{ marginBottom: 15 }}>
          <strong>Email:</strong> {user.email}
        </div>
        <div style={{ marginBottom: 15 }}>
          <strong>Vai trò:</strong> {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
        </div>
      </div>
    </div>
  );
}