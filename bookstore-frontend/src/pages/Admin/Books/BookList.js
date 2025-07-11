import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import './BookList.css';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/books')
      .then(r => {
        if (r.data?.data) setBooks(r.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = id => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
      api.delete(`/books/${id}`)
        .then(() => setBooks(books.filter(x => x.id !== id)))
        .catch(error => {
          console.error('Xóa thất bại:', error);
          alert('Xóa thất bại!');
        });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="book-list-container">
      <div className="header">
        <h2>Quản lý Sách</h2>
        <Link to="/admin/books/new" className="btn btn-add">
          <span className="btn-icon">+</span> Thêm Sách Mới
        </Link>
      </div>
      
      <div className="table-container">
        {books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>Không có sách nào</h3>
            <p>Hãy thêm sách mới để bắt đầu quản lý</p>
            <Link to="/admin/books/new" className="btn btn-add">
              Thêm Sách Mới
            </Link>
          </div>
        ) : (
          <table className="book-table">
            <thead>
              <tr>
                <th>Bìa</th>
                <th>Tên Sách</th>
                <th>Tác giả</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {books.map(b => (
                <tr key={b.id}>
                  <td>
                    <div className="cover-container">
                      <img
                        src={b.image_url || '/assets/placeholder-book.jpg'}
                        alt={b.title}
                        className="book-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/placeholder-book.jpg';
                        }}
                      />
                    </div>
                  </td>
                  <td className="book-title">{b.title}</td>
                  <td>{b.author_name}</td>
                  <td className="book-price">{b.price.toLocaleString()} VND</td>
                  <td className={`stock ${b.stock < 5 ? 'low-stock' : ''}`}>
                    {b.stock}
                    {b.stock < 5 && <span className="stock-warning">!</span>}
                  </td>
                  <td className="actions">
                    <Link to={`/admin/books/${b.id}`} className="btn btn-edit">
                      Sửa
                    </Link>
                    <button className="btn btn-delete" onClick={() => handleDelete(b.id)}>
                      Xóa
                    </button>
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