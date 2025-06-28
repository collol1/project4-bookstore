import BookCard from '../../components/BookCard';
import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../api/api';
import './Home.css'; // Nhập file CSS

export default function Home() {
  const [books, setBooks] = useState([]);
  const { addToCart } = useContext(CartContext);
   const location = useLocation();

  // Sử dụng useEffect để gọi API khi component mount
  useEffect(() => {
    api.get('/books').then(r => {
      if (r.data && r.data.data) {
        setBooks(r.data.data);
      } else {
        setBooks([]);
      }
    });
  }, []);

  return (  <div>
      {location.state?.message && (
        <div style={{ color: 'green', margin: 10 }}>{location.state.message}</div>
      )}
    <>
      <div className="homepage">
      <div className="book-list">
        <h1>Danh sách sách</h1>
        <div className="book-grid">
          {books.map(b => (
            <div key={b.id} className="book-item">
              <h4>{b.title}</h4>
              <p>{b.description ? b.description.slice(0, 100) + '...' : 'Không có mô tả'}</p>
              <p>Tác giả: {b.author ? b.author.name : 'N/A'}</p>
              <p>Thể loại: {b.category ? b.category.name : 'N/A'}</p>
              <p>Nhà xuất bản: {b.publisher ? b.publisher.name : 'N/A'}</p>
              <p>Ngày xuất bản: {b.publishedDate ? new Date(b.publishedDate).toLocaleDateString() : 'N/A'}</p>
              <p>Đánh giá: {b.rating ? b.rating.toFixed(1) : 'Chưa có đánh giá'}</p>
              <p>Số lượng: {b.stock ? b.stock : 'Hết hàng'}</p>
             <button onClick={() =>  addToCart(b)} style={{ backgroundColor: 'green', color: 'white' }} url={'/cart'}>
                Thêm vào giỏ
              </button>
              <p>{b.price ? `${b.price.toLocaleString()} VND` : 'N/A'}</p>
              <Link to={`/books/${b.id}` }><button style={{ backgroundColor: 'orange', color: 'white' }}>Chi tiết</button></Link>
            </div>
          ))}
        </div>
      </div>
        </div>
      
    </>
    </div>
  );
}