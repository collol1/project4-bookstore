
import React from 'react';
import './BookCard.css';

export default function BookCard({ book, onAddToCart }) {
  return (
    <div className="book-card">
      <img src={book.imageUrl || '/assets/'} alt={book.title} />
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <p>${book.price}</p>
      <button onClick={() => onAddToCart(book)}>Add to Cart</button>
    </div>
  );
}
