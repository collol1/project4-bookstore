import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <ul>
        <li><Link to="users">Users</Link></li>
        <li><Link to="books">Books</Link></li>
        <li><Link to="categories">Categories</Link></li>
        <li><Link to="authors">Authors</Link></li>
      </ul>
    </div>
  );
}
