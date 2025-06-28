import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/api';

export default function AuthorForm() {
  const { id } = useParams(), nav = useNavigate();
  const [f, setF] = useState({ name:'', biography:'', birth_date:'', image_url:'' });

  useEffect(()=>{
    if (id) api.get(`/authors/${id}`).then(r=>setF(r.data));
  }, [id]);

  const sub = async e=>{
    e.preventDefault();
    if (id) await api.put(`/authors/${id}`, f);
    else await api.post('/authors', f);
    nav('/admin/authors');
  };

  return (
    <div style={{ padding:20 }}>
      <h2>{id?'Edit':'New'} Author</h2>
      <form onSubmit={sub}>
        {['name','biography','birth_date','image_url'].map(k=>(
          <div key={k} style={{ margin:'10px 0' }}>
            <input name={k} placeholder={k} value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})} required />
          </div>
        ))}
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
