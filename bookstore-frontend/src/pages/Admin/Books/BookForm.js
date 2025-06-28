import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../../api/api';

export default function BookForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: '', authorId: '', price: 0, stock: 0, imageUrl: ''
  });
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    api.get('/authors').then(r => setAuthors(r.data.data || []));
    if (isEdit) {
      api.get(`/books/${id}`).then(r => setBook(r.data.data));
    }
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    setBook(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const request = isEdit
      ? api.put(`/books/${id}`, book)
      : api.post('/books', book);
    request.then(() => navigate('/admin/books'));
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">{isEdit ? 'Edit Book' : 'Add New Book'}</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                name="title"
                value={book.title}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            {/* Author */}
            <div className="mb-3">
              <label className="form-label">Author</label>
              <select
                name="authorId"
                value={book.authorId}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Select an author --</option>
                {authors.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            {/* Price & Stock */}
            <div className="row g-3 mb-3">
              <div className="col">
                <label className="form-label">Price (VND)</label>
                <input
                  type="number"
                  name="price"
                  value={book.price}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="col">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={book.stock}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            {/* Image URL */}
            <div className="mb-3">
              <label className="form-label">Cover Image URL</label>
              <input
                name="imageUrl"
                value={book.imageUrl}
                onChange={handleChange}
                className="form-control"
                placeholder="https://..."
              />
            </div>
            {/* Buttons */}
            <div className="d-flex justify-content-end">
              <Link to="/admin/books" className="btn btn-secondary me-2">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary">
                {isEdit ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
