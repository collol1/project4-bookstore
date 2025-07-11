import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import styles from './CategoryList.module.css';

export default function CategoryList() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/categories')
      .then(r => {
        if (r.data && Array.isArray(r.data.data)) setCats(r.data.data);
        else setCats([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const del = async id => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await api.delete(`/categories/${id}`);
        setCats(cats.filter(c => c.id !== id));
      } catch (error) {
        alert('Xóa thất bại! Danh mục có thể đang chứa sách');
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Quản lý Danh mục</h2>
        <Link to="new" className={styles.addButton}>
          <span className={styles.btnIcon}>+</span> Thêm Danh mục
        </Link>
      </div>
      
      <div className={styles.tableContainer}>
        {cats.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏷️</div>
            <h3>Không có danh mục nào</h3>
            <p>Hãy thêm danh mục mới để bắt đầu quản lý</p>
            <Link to="new" className={styles.addButton}>
              Thêm Danh mục
            </Link>
          </div>
        ) : (
          <table className={styles.categoryTable}>
            <thead>
              <tr>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cats.map(c => (
                <tr key={c.id}>
                  <td className={styles.categoryName}>{c.name}</td>
                  <td className={styles.categoryDescription}>{c.description || '—'}</td>
                  <td className={styles.actions}>
                    <Link to={`${c.id}`} className={styles.editButton}>Sửa</Link>
                    <button className={styles.deleteButton} onClick={() => del(c.id)}>Xóa</button>
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