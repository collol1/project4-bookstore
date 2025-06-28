import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CartContext } from '../context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const { cartItems } = useContext(CartContext);

  return (
  <>
   <div className="homepage">
        <nav className="navbar">
          <div className="nav-left">
            <Link to="/" className="nav-item">Trang chủ</Link>
            <Link to="/admin" className="nav-item">Quản trị</Link>
            <Link to="/books" className="nav-item">Sách</Link>
            <Link to="/categories" className="nav-item">Thể loại</Link>
            <Link to="/cart" className="nav-item" >Giỏ hàng ({cartItems.length})</Link>
          </div>
          <div className="nav-right"> 
            <a href="/login" className="nav-item">Đăng xuất</a>
            <Link to="/login" className="nav-item">Đăng nhập</Link>
          </div>
        </nav>
        </div>
  </>
  );
}