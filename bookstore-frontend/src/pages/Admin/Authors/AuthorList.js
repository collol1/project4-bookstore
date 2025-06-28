import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';

export default function AuthorList() {
  const [as, setAs] = useState([]);
useEffect(() => { 
  api.get('/authors').then(r => {
    // Kiểm tra cấu trúc dữ liệu
    if (r.data && Array.isArray(r.data)) {
      setAs(r.data);
    } else if (r.data && Array.isArray(r.data.data)) {
      setAs(r.data.data);
    } else {
      setAs([]);
    }
  }); 
}, []);
  const del = async id => {
    if(window.confirm('Xoá?')) {
      await api.delete(`/authors/${id}`);
      setAs(as.filter(a=>a.id!==id));
    }
  };
  return (
    <div style={{ padding:20 }}>
      <h2>Authors</h2>
      <Link to="new"><button>Thêm</button></Link>
      <table>
  <thead>
    <tr>
      <th>Tên</th>
      <th>Hành động</th>
    </tr>
  </thead>
  <tbody>
    {as.map(a => (
      <tr key={a.id}>
        <td>{a.name}</td>
        <td>
          <Link to={a.id}><button>Edit</button></Link>
          <button onClick={() => del(a.id)}>Del</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}
