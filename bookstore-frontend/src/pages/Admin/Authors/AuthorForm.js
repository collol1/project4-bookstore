import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import './AuthorForm.css';

export default function AuthorForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', biography: '', birth_date: '', image_url: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/authors/${id}`)
        .then(r => setForm(r.data.data || r.data))
        .catch(() => setError('Không thể tải dữ liệu tác giả'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (id) {
        await api.put(`/authors/${id}`, form);
      } else {
        await api.post('/authors', form);
      }
      nav('/admin/authors');
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="form-loading">
        <div className="loading-spinner"></div>
        <p>Đang {id ? 'cập nhật' : 'tạo'} tác giả...</p>
      </div>
    );
  }

  return (
    <div className="author-form-container">
      <div className="form-header">
        <h2>{id ? 'Chỉnh sửa Tác giả' : 'Thêm Tác giả Mới'}</h2>
        <button onClick={() => nav('/admin/authors')} className="btn btn-back">
          &larr; Quay lại
        </button>
      </div>
      
      {error && <div className="form-error">{error}</div>}
      
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên tác giả *</label>
            <input
              name="name"
              placeholder="Nhập tên tác giả"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Tiểu sử</label>
            <textarea
              name="biography"
              placeholder="Tiểu sử tác giả"
              value={form.biography}
              onChange={handleChange}
              rows="6"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Ngày sinh</label>
              <input
                type="date"
                name="birth_date"
                value={form.birth_date}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Ảnh tác giả (URL)</label>
              <input
                name="image_url"
                placeholder="https://example.com/image.jpg"
                value={form.image_url}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {form.image_url && (
            <div className="image-preview">
              <img src={form.image_url} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
              <small>Xem trước ảnh tác giả</small>
            </div>
          )}
          
          <div className="form-actions">
            <button type="button" onClick={() => nav('/admin/authors')} className="btn btn-cancel">
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-submit" disabled={loading}>
              {id ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}