// src/pages/Authors/Authors.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './Authors.css';

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/authors')
      .then(res => {
        setAuthors(res.data?.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAuthorClick = (authorId) => {
  navigate(`/books/by-author/${authorId}`); // Sửa đường dẫn
};

  if (loading) return <div>Đang tải danh sách tác giả...</div>;

  return (
    <div className="homepage">
      <div className="authors-page">
        <h2>Tác giả</h2>
        <ul>
          {authors.map(author => (
            <li 
              key={author.id} 
              onClick={() => handleAuthorClick(author.id)}
              style={{ cursor: 'pointer' }}
            >
              <h3>{author.name}</h3>
              <p>{author.biography}</p>
              <p>Ngày sinh: {author.birth_date}</p>
              <img 
                src={author.image_url || '/placeholder-author.jpg'} 
                alt={author.name} 
                style={{ width: 100, height: 100 }} 
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}