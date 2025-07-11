import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css'; // Import your CSS for styling

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-columns">
            <div className="footer-column">
              <h3 className="footer-title">Về Chúng Tôi</h3>
              <p className="footer-about">
                BookStore là nơi bạn có thể tìm thấy hàng ngàn đầu sách chất lượng với giá cả phải chăng. 
                Chúng tôi cam kết mang đến trải nghiệm mua sắm trực tuyến tốt nhất cho độc giả.
              </p>
              <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <FaFacebookF />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <FaTwitter />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagram />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
            
            <div className="footer-column">
              <h3 className="footer-title">Liên Kết Nhanh</h3>
              <ul className="footer-links">
                <li><Link to="/">Trang Chủ</Link></li>
                <li><Link to="/books">Sách Mới</Link></li>
                <li><Link to="/categories">Thể Loại</Link></li>
                <li><Link to="/authors">Tác Giả</Link></li>
                <li><Link to="/cart">Giỏ Hàng</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3 className="footer-title">Thể Loại Sách</h3>
              <ul className="footer-links">
                <li><Link to="/books/by-category/1">Văn học</Link></li>
                <li><Link to="/books/by-category/2">Kinh tế</Link></li>
                <li><Link to="/books/by-category/3">Khoa học</Link></li>
                <li><Link to="/books/by-category/4">Lịch sử</Link></li>
                <li><Link to="/books/by-category/5">Tâm lý</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3 className="footer-title">Liên Hệ</h3>
              <ul className="contact-info">
                <li>
                  <FaMapMarkerAlt />
                  <span>28A Lê Trọng Tấn, Hà Đông, Hà Nội</span>
                </li>
                <li>
                  <FaPhone />
                  <span>(+84) 123 456 789</span>
                </li>
                <li>
                  <FaEnvelope />
                  <span>admin@bookstore.com</span>
                </li>
              </ul>
              <div className="newsletter">
                <h4>Đăng ký nhận tin</h4>
                <form>
                  <input type="email" placeholder="Email của bạn" />
                  <button type="submit">Đăng ký</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} BookStore. </p> 
          <p> Thành viên admin: Mr.Huỳnh, Mr.Thành, Mr.Trường con</p>
          <div className="payment-methods">
            <span>Phương thức thanh toán:</span>
            <div className="payment-icons">
              <span>Visa</span>
              <span>MasterCard</span>
              <span>PayPal</span>
              <span>Momo</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;