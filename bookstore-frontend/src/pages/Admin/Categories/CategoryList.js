import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import styles from './CategoryList.module.css';

export default function CategoryList() {
  const [cats, setCats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/categories')
      .then(r => {
        if (r.data && Array.isArray(r.data)) setCats(r.data);
        else if (r.data && Array.isArray(r.data.data)) setCats(r.data.data);
        else setCats([]);
      })
      .catch(() => setError('Không thể tải danh mục'))
      .finally(() => setIsLoading(false));
  }, []);

  const del = async id => {
    if (window.confirm('Xóa danh mục này?')) {
      await api.delete(`/categories/${id}`);
      setCats(cats.filter(c => c.id !== id));
    }
  };

  if (isLoading) return <div className={styles.loading}>Đang tải...</div>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2>Danh mục</h2>
      <Link to="new"><button className={styles.button}>Thêm</button></Link>
      <ul>
        {cats.map(c => (
          <li key={c.id} className={styles.item}>
            {c.name}
            <Link to={c.id}><button className={styles.buttonSecondary}>Sửa</button></Link>
            <button className={styles.buttonDanger} onClick={() => del(c.id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}