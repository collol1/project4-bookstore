import React from 'react';

export default function Button({ children, onClick, ...props }) {
  return (
    <button onClick={onClick} {...props} style={{ padding: '8px 16px' }}>
      {children}
    </button>
  );
}
