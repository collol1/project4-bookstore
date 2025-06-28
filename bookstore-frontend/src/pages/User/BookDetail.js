import React, { useEffect, useState, useContext, use } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import styles from './BookDetail.module.css';
import axios from 'axios';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null); ;
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
useEffect(() => {
  console.log("Fetching book details for ID:", id);
  dataBook();
}, [id]);

const dataBook = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/books/${id}`);
    setBook(response.data.data);
    console.log("Fetched book data:", response.data.data);
  } catch {
    setError('Không thể tải chi tiết sách');
  }
};

useEffect(() => {
  if (book) {
    console.log("Updated book state:", book);
  }
}, [book]);

  if (!book) return <div className={styles.loading}>Đang tải...</div>;

  const handleAddToCart = () => {
    addToCart(book);
    // Sẽ thay bằng react-toastify sau
    alert('Đã thêm vào giỏ');
  };

  return (
    <div className='homepage'>
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}
      <h2>{book.title}</h2> 
      <p>{book.description}</p>
      <p>{book.price} VND</p>
      <button className={styles.button} onClick={handleAddToCart}>Thêm vào giỏ</button>
      {user && <button className={styles.buttonSecondary} onClick={() => navigate('/')}>Quay lại</button>}
    </div>
    </div>
  );
}