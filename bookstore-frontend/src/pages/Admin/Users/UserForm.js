import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import './UserForm.css';

export default function UserForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    role: 'user',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = Boolean(id);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/users/${id}`)
        .then(res => {
          const user = res.data.data;
          setForm({
            username: user.username,
            email: user.email,
            role: user.role,
            password: '' // Mật khẩu không lấy từ server
          });
        })
        .catch(() => setError('Không thể tải dữ liệu người dùng'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        // Nếu là chỉnh sửa, chỉ gửi password nếu có thay đổi
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await api.put(`/users/${id}`, payload);
      } else {
        await api.post('/users', form);
      }
      nav('/admin/users');
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
        <p>Đang {isEdit ? 'cập nhật' : 'tạo'} người dùng...</p>
      </div>
    );
  }

  return (
    <div className="user-form-container">
      <div className="form-header">
        <h2>{isEdit ? 'Chỉnh sửa Người dùng' : 'Thêm Người dùng Mới'}</h2>
        <button onClick={() => nav('/admin/users')} className="btn btn-back">
          &larr; Quay lại
        </button>
      </div>
      
      {error && <div className="form-error">{error}</div>}
      
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên đăng nhập *</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="Nhập tên đăng nhập"
              disabled={isEdit}
            />
          </div>
          
          <div className="form-group">
            <label>Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Nhập email"
            />
          </div>
          
          <div className="form-group">
            <label>Quyền *</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>
              Mật khẩu {!isEdit && '*'}
              {isEdit && <small> (Để trống nếu không thay đổi)</small>}
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder={isEdit ? "Nhập mật khẩu mới" : "Nhập mật khẩu"}
              minLength={isEdit ? 0 : 6}
              required={!isEdit}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => nav('/admin/users')} className="btn btn-cancel">
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-submit" disabled={loading}>
              {isEdit ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}