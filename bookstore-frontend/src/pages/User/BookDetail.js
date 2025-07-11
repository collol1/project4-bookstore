import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { CartContext } from '../../context/CartContext';
import styles from './BookDetail.module.css';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${id}`);
        setBook(response.data.data);
      } catch (err) {
        setError('Không thể tải chi tiết sách');
      }
    };

    fetchBook();
  }, [id]);

  if (!book) return <div className={styles.loading}>Đang tải...</div>;

  const handleAddToCart = () => {
    addToCart(book);
    alert('Đã thêm vào giỏ');
  };

  return (
     <div className={styles.lightPage}> {/* Thêm lớp mới cho trang sáng */}
      <div className={styles.container}>
        {error && <p className={styles.error}>{error}</p>}
        
        <div className={styles.bookHeader}>
          <button 
            className={styles.buttonSecondary} 
            onClick={() => navigate(-1)}
          >
            &larr; Quay lại
          </button>
          <h1>{book.title}</h1>
        </div>
        
        <div className={styles.bookContent}>
          <div className={styles.bookImage}>
            <img 
              src={book.image_url || '/placeholder-book.jpg'} 
              alt={book.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-book.jpg';
              }}
            />
          </div>
          
          <div className={styles.bookInfo}>
            <p><strong>Tác giả:</strong> {book.author_name}</p>
            <p><strong>Thể loại:</strong> {book.category_name}</p>
            <p><strong>Ngày xuất bản:</strong> {new Date(book.published_date).toLocaleDateString()}</p>
            <p><strong>Số lượng tồn kho:</strong> {book.stock} cuốn</p>
            <p className={styles.price}>{book.price?.toLocaleString()} VND</p>
            
            <button 
              className={styles.button} 
              onClick={handleAddToCart}
              disabled={book.stock <= 0}
            >
              {book.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
            </button>
          </div>
        </div>
        
        <div className={styles.bookDescription}>
          <h3>Mô tả sách</h3>
          <p>{book.description || 'Chưa có mô tả cho cuốn sách này.'}</p>
        </div>
      </div>
    </div>
  );
}