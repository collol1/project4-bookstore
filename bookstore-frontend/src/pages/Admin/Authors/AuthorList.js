import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import './AuthorList.css';

export default function AuthorList() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/authors')
      .then(r => {
        if (r.data && Array.isArray(r.data)) setAuthors(r.data);
        else if (r.data && Array.isArray(r.data.data)) setAuthors(r.data.data);
        else setAuthors([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async id => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tác giả này?')) {
      try {
        await api.delete(`/authors/${id}`);
        setAuthors(authors.filter(a => a.id !== id));
      } catch (error) {
        alert('Xóa thất bại! Tác giả có thể đang có sách liên quan');
      }
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
    <div className="author-list-container">
      <div className="header">
        <h2>Quản lý Tác giả</h2>
        <Link to="new" className="btn btn-add">
          <span className="btn-icon">+</span> Thêm Tác giả
        </Link>
      </div>
      
      <div className="table-container">
        {authors.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✍️</div>
            <h3>Không có tác giả nào</h3>
            <p>Hãy thêm tác giả mới để bắt đầu quản lý</p>
            <Link to="new" className="btn btn-add">
              Thêm Tác giả
            </Link>
          </div>
        ) : (
          <table className="author-table">
            <thead>
              <tr>
                <th>Tên tác giả</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {authors.map(a => (
                <tr key={a.id}>
                  <td className="author-name">
                    <div className="author-info">
                      {a.image_url && (
                        <img 
                          src={a.image_url} 
                          alt={a.name} 
                          className="author-avatar"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/placeholder-avatar.jpg';
                          }}
                        />
                      )}
                      <span>{a.name}</span>
                    </div>
                  </td>
                  <td className="actions">
                    <Link to={a.id} className="btn btn-edit">
                      Sửa
                    </Link>
                    <button className="btn btn-delete" onClick={() => handleDelete(a.id)}>
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