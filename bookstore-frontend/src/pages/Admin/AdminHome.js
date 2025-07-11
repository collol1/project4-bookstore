import React from 'react';
import { Link } from 'react-router-dom';
import './AdminHome.css';

export default function AdminHome() {
  return (
    <div className="admin-home-container">
      <h1 className="admin-home-title">Trang Quản Trị</h1>
      <div className="admin-dashboard">
        <Link to="/admin/books" className="admin-card book-card">
          <div className="card-icon">📚</div>
          <h3 className="admin-card-title">Quản lý Sách</h3>
          <p className="admin-card-description">Thêm, sửa, xóa sách</p>
        </Link>
        
        <Link to="/admin/categories" className="admin-card category-card">
          <div className="card-icon">🏷️</div>
          <h3 className="admin-card-title">Quản lý Danh mục</h3>
          <p className="admin-card-description">Quản lý thể loại sách</p>
        </Link>
        
        <Link to="/admin/authors" className="admin-card author-card">
          <div className="card-icon">✍️</div>
          <h3 className="admin-card-title">Quản lý Tác giả</h3>
          <p className="admin-card-description">Quản lý thông tin tác giả</p>
        </Link>
        
        <Link to="/admin/users" className="admin-card user-card">
          <div className="card-icon">👥</div>
          <h3 className="admin-card-title">Quản lý Người dùng</h3>
          <p className="admin-card-description">Quản lý tài khoản người dùng</p>
        </Link>
      </div>
    </div>
  );
}