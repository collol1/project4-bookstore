import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './Books.css';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterName, setFilterName] = useState('');
  const params = useParams();
  const navigate = useNavigate();
  
  const authorId = params.authorId;
  const categoryId = params.categoryId;

  useEffect(() => {
  const fetchBooks = async () => {
    try {
      console.log(`Fetching books for: ${authorId ? 'author' : 'category'} ID: ${authorId || categoryId}`);
      
      if (authorId) {
        // Lấy thông tin tác giả
        const authorRes = await api.get(`/authors/${authorId}`);
        console.log('Author response:', authorRes.data);
        setFilterName(authorRes.data.data.name || 'Tác giả');
        setFilterType('author');
        
        // Sử dụng endpoint mới
        const booksRes = await api.get(`/books/by-author/${authorId}`);
        console.log('Books by author response:', booksRes.data);
        setBooks(booksRes.data?.data || []);
      } 
      else if (categoryId) {
        // Lấy thông tin thể loại
        const categoryRes = await api.get(`/categories/${categoryId}`);
        console.log('Category response:', categoryRes.data);
        setFilterName(categoryRes.data.data.name || 'Thể loại');
        setFilterType('category');
    
        
        // Sử dụng endpoint mới
        const booksRes = await api.get(`/books/by-category/${categoryId}`);
        console.log('Books by category response:', booksRes.data);
        setBooks(booksRes.data?.data || []);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu sách:', error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  fetchBooks();
}, [authorId, categoryId]);

  const handleBack = () => {
    if (filterType === 'author') {
      navigate('/authors');
    } else {
      navigate('/categories');
    }
  };

  if (loading) return <div className="loading">Đang tải danh sách sách...</div>;

  return (
      <div className="books-page">
        <div className="header-section">
          <button onClick={handleBack} className="back-button">
            &larr; Quay lại
          </button>
          <h2>
            Sách {filterType === 'author' ? 'của tác giả' : 'thuộc thể loại'}: 
            <span className="filter-name"> {filterName}</span>
          </h2>
        </div>
        
        {loading ? (
          <div className="loading">Đang tải danh sách sách...</div>
        ) : books.length === 0 ? (
          <div className="no-books">
            <p>Không có sách nào được tìm thấy.</p>
            <p>Vui lòng kiểm tra lại sau.</p>
          </div>
        ) : (
        <div className="book-list">
          {books.map(book => (
            <div key={book.id} className="book-card">
              <div className="book-image">
                <img src={book.image_url || '/placeholder-book.jpg'} alt={book.title} />
              </div>
              <div className="book-details">
                <h3>{book.title}</h3>
                <p className="author">Tác giả: {book.author_name}</p>
                <p className="price">
                  Giá: ${book.price ? 
                    (typeof book.price === 'number' ? book.price.toFixed(2) : parseFloat(book.price).toFixed(2)) 
                    : '0.00'}
                </p>
                <p className="stock">Tồn kho: {book.stock} cuốn</p>
                <p className="description">
                  {book.description || 'Chưa có mô tả cho cuốn sách này.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}