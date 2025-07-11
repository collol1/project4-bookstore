import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import './CategoryForm.css';

export default function CategoryForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', image_url: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/categories/${id}`)
        .then(r => setForm(r.data.data || r.data))
        .catch(() => setError('Không thể tải dữ liệu danh mục'))
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
        await api.put(`/categories/${id}`, form);
      } else {
        await api.post('/categories', form);
      }
      nav('/admin/categories');
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
        <p>Đang {id ? 'cập nhật' : 'tạo'} danh mục...</p>
      </div>
    );
  }

  return (
    <div className="category-form-container">
      <div className="form-header">
        <h2>{id ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục Mới'}</h2>
        <button onClick={() => nav('/admin/categories')} className="btn btn-back">
          &larr; Quay lại
        </button>
      </div>
      
      {error && <div className="form-error">{error}</div>}
      
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên danh mục *</label>
            <input
              name="name"
              placeholder="Nhập tên danh mục"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="description"
              placeholder="Mô tả danh mục"
              value={form.description}
              onChange={handleChange}
              rows="4"
            />
          </div>
          
          <div className="form-group">
            <label>Ảnh minh họa (URL)</label>
            <input
              name="image_url"
              placeholder="https://example.com/image.jpg"
              value={form.image_url}
              onChange={handleChange}
            />
            {form.image_url && (
              <div className="image-preview">
                <img src={form.image_url} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                <small>Xem trước</small>
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => nav('/admin/categories')} className="btn btn-cancel">
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