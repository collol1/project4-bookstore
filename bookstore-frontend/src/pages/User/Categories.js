// src/pages/Categories/Categories.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './Categories.css';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories')
      .then(res => {
        setCategories(res.data?.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCategoryClick = (categoryId) => {
  navigate(`/books/by-category/${categoryId}`); // Sửa đường dẫn
};

  if (loading) return <div>Đang tải danh sách thể loại...</div>;

  return (
    <div className="homepage">
      <div className="categories-page">
        <h2>Thể loại sách</h2>
        <ul>
          {categories.map(cat => (
            <li 
              key={cat.id} 
              onClick={() => handleCategoryClick(cat.id)}
              style={{ cursor: 'pointer' }}
            >
              <strong>{cat.name}</strong>
              {cat.description && <span> - {cat.description}</span>}
              <img 
                src={cat.image_url || '/placeholder-category.jpg'} 
                alt={cat.name} 
                style={{ width: 50, height: 50, marginLeft: 10 }} 
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}