import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import './UserList.css';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/users')
      .then(res => {
        setUsers(res.data?.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <div className="header">
        <h2>Quản lý Người dùng</h2>
        <Link to="new" className="btn btn-add">
          <span className="btn-icon">+</span> Thêm Người dùng
        </Link>
      </div>
      
      <div className="table-container">
        {users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>Không có người dùng nào</h3>
            <p>Hãy thêm người dùng mới</p>
            <Link to="new" className="btn btn-add">
              Thêm Người dùng
            </Link>
          </div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên đăng nhập</th>
                <th>Email</th>
                <th>Quyền</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td className="user-name">{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge ${u.role === 'admin' ? 'admin' : 'user'}`}>
                      {u.role === 'admin' ? 'Quản trị' : 'Người dùng'}
                    </span>
                  </td>
                  <td className="actions">
                    <Link to={`${u.id}`} className="btn btn-edit">
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}