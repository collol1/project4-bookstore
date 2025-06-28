import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';

export default function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.get('/books').then(r => {
      if (r.data?.data) setBooks(r.data.data);
    });
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Book Management</h2>
        <Link to="/admin/books/new" className="btn btn-success">
          + Add New Book
        </Link>
      </div>
      <div className="table-responsive bg-white p-3 rounded shadow-sm">
        <table className="table table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th scope="col">Cover</th>
              <th scope="col">Title</th>
              <th scope="col">Author</th>
              <th scope="col">Price</th>
              <th scope="col">Stock</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b.id}>
                <td>
                  <img
                    src={b.imageUrl || '/assets/background.jpg'}
                    alt={b.title}
                    style={{ width: 60, height: 90, objectFit: 'cover' }}
                  />
                </td>
                <td>{b.title}</td>
                <td>{b.authorName}</td>
                <td>{b.price.toLocaleString()} VND</td>
                <td>{b.stock}</td>
                <td>
                  <Link
                    to={`/admin/books/${b.id}/edit`}
                    className="btn btn-sm btn-primary me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-danger me-2"
                    onClick={() => {
                      if (window.confirm('Delete this book?')) {
                        api.delete(`/books/${b.id}`).then(() =>
                          setBooks(books.filter(x => x.id !== b.id))
                        );
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
