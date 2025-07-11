import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../../api/api';
import './BookForm.css';

export default function BookForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  
  const [book, setBook] = useState({ 
    title: '', 
    author_id: '', 
    description: '',
    price: 0, 
    stock: 0, 
    image_url: '',
    category_id: '',
    published_date: '',
    isbn: ''
  });

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    
    const fetchData = async () => {
      try {
        const [authorsRes, categoriesRes] = await Promise.all([
          api.get('/authors'),
          api.get('/categories')
        ]);
        
        setAuthors(authorsRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
        
        if (isEdit) {
          const bookRes = await api.get(`/books/${id}`);
          setBook(bookRes.data.data);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu cần thiết');
        console.error('Lỗi khi tải dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    if (name === 'price' || name === 'stock') {
      processedValue = value === '' ? 0 : Number(value);
      if (processedValue < 0) processedValue = 0;
    }
    
    setBook(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const payload = {
        title: book.title,
        author_id: book.author_id,
        description: book.description,
        price: book.price,
        category_id: book.category_id,
        stock: book.stock,
        image_url: book.image_url,
        published_date: book.published_date,
        isbn: book.isbn
      };

      if (isEdit) {
        await api.put(`/books/${id}`, payload);
      } else {
        await api.post('/books', payload);
      }
      
      navigate('/admin/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau');
      console.error('Operation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="form-loading">
        <div className="loading-spinner"></div>
        <p>Đang {isEdit ? 'cập nhật' : 'tạo'} sách...</p>
      </div>
    );
  }

  return (
    <div className="book-form-container">
      <div className="form-header">
        <h2>{isEdit ? 'Chỉnh sửa Sách' : 'Thêm Sách Mới'}</h2>
        <Link to="/admin/books" className="btn btn-back">
          &larr; Quay lại
        </Link>
      </div>
      
      {error && <div className="form-error">{error}</div>}
      
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="section-title">Thông tin cơ bản</h3>
            <div className="form-group">
              <label>Tên sách *</label>
              <input
                name="title"
                value={book.title}
                onChange={handleChange}
                required
                placeholder="Nhập tên sách"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Tác giả *</label>
                <select
                  name="author_id"
                  value={book.author_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn tác giả --</option>
                  {authors.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Thể loại *</label>
                <select
                  name="category_id"
                  value={book.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn thể loại --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                name="description"
                value={book.description}
                onChange={handleChange}
                rows="4"
                placeholder="Mô tả về sách"
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="section-title">Thông tin chi tiết</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Giá (VND) *</label>
                <input
                  type="number"
                  name="price"
                  value={book.price}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label>Số lượng tồn kho *</label>
                <input
                  type="number"
                  name="stock"
                  value={book.stock}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Ngày xuất bản</label>
                <input
                  type="date"
                  name="published_date"
                  value={book.published_date}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>ISBN</label>
                <input
                  name="isbn"
                  value={book.isbn}
                  onChange={handleChange}
                  placeholder="Mã ISBN"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Ảnh bìa (URL)</label>
              <input
                name="image_url"
                value={book.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              {book.image_url && (
                <div className="image-preview">
                  <img src={book.image_url} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                  <small>Xem trước</small>
                </div>
              )}
            </div>
          </div>
          
          <div className="form-actions">
            <Link to="/admin/books" className="btn btn-cancel">
              Hủy bỏ
            </Link>
            <button type="submit" className="btn btn-submit" disabled={loading}>
              {isEdit ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}