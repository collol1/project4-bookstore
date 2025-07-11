import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import  '../pages/User/Home.css'; // Import CSS module
import logo from '../assets/logo.jpg';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="logo">
            <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
          </Link>
          <Link to="/" className="nav-item">Trang chủ</Link>
          <Link to="/categories" className="nav-item">Thể loại</Link>
          <Link to="/authors" className="nav-item">Tác giả</Link>
          <Link to="/cart" className="nav-item">Giỏ hàng ({cartItems.length})</Link>
          
          {/* Thêm menu profile nếu đã đăng nhập */}
          {user && (
            <Link to="/profile" className="nav-item">Hồ sơ</Link>
          )}
          
          {/* Thêm menu quản trị nếu là admin */}
          {user && user.role === 'admin' && (
            <Link to="/admin" className="nav-item">Quản trị</Link>
          )}
        </div>
       <div className="nav-right"> 
          {user ? (
            <>
              <span className="nav-item" >Xin chào, {user.username}</span>
              <a href="/" className="nav-item" onClick={(e) => { e.preventDefault(); logout(); }}>Đăng xuất</a>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">Đăng nhập</Link>
              <Link to="/register" className="nav-item">Đăng ký</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}