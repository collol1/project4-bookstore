import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/api';

export default function CategoryForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', image_url: '' });

  useEffect(() => {
    if (id) api.get(`/categories/${id}`).then(r=>setForm(r.data));
  }, [id]);

  const sub = async e => {
    e.preventDefault();
    if (id) await api.put(`/categories/${id}`, form);
    else await api.post('/categories', form);
    nav('/admin/categories');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{id ? 'Edit' : 'New'} Category</h2>
      <form onSubmit={sub}>
        {['name','description','image_url'].map(f=>(
          <div key={f} style={{ margin: '10px 0' }}>
            <input name={f} placeholder={f} value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})} required />
          </div>
        ))}
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
