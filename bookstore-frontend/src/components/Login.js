import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Đăng nhập thất bại');
    }
  };

  return (
    
    <div style={{ maxWidth: 400, margin: '50px auto' }} className="login-container">
      
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
           type="email"
           placeholder="Email"
            value={email}
             onChange={e => setEmail(e.target.value)}
               required
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
  style={{
    marginTop: 20,
    backgroundColor: '#4CAF50', // xanh lá
    color: 'white',
    border: 'none',
  }}
  type="submit"
>
  Login
</button>

      </form>
    </div>
    
  );
}
