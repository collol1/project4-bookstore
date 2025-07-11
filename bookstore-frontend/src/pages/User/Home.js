import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import api from '../../api/api';
import './Home.css';
import './Books.css';
import Footer from '../../components/Footer'; // Import Footer

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const location = useLocation();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books');
        setBooks(response.data?.data || []);
      } catch (error) {
        console.error('Lỗi khi tải sách:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div className="loading">Đang tải danh sách sách...</div>;

  return (
    <div className="homepage">
      {location.state?.message && (
        <div className="success-message">{location.state.message}</div>
      )}
      
      <div className="books-page">
        <h1>Sách Mới</h1>
        
        {books.length === 0 ? (
          <div className="no-books">
            <p>Không có sách nào được tìm thấy.</p>
          </div>
        ) : (
          <div className="book-list">
            {books.map(book => (
              <div key={book.id} className="book-card">
                <div className="book-image">
                  <img 
                    src={book.image_url || '/placeholder-book.jpg'} 
                    alt={book.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-book.jpg';
                    }}
                  />
                </div>
                <div className="book-details">
                  <h3>{book.title}</h3>
                  <p className="author">Tác giả: {book.author_name}</p>
                  <p className="price">
                    {book.price ? `${book.price.toLocaleString()} VND` : 'Liên hệ'}
                  </p>
                  <p className="stock">Tồn kho: {book.stock} cuốn</p>
                  <p className="description">
                    {book.description?.slice(0, 100) || 'Chưa có mô tả cho cuốn sách này.'}
                    {book.description?.length > 100 && '...'}
                  </p>
                  
                  <div className="book-actions">
                    <button 
                      className="button" 
                      onClick={() => addToCart(book)}
                    >
                      Thêm vào giỏ
                    </button>
                    <Link 
                      to={`/books/${book.id}`} 
                      className="button buttonSecondary"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    
      <Footer />
    
    </div>
  );
}