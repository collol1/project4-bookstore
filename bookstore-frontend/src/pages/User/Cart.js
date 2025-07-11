import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import styles from './Cart.module.css';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCartItemQuantity } = useContext(CartContext);

  const updateQty = (id, delta) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      const newQty = Math.max(1, item.qty + delta);
      updateCartItemQuantity(id, newQty);
    }
  };

  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className='homepage'>
      <div className={styles.cart}>
        <h2>Giỏ hàng</h2>
        {cartItems.map(item => (
          <div key={item.id} className={styles.item}>
            {item.title} - {item.price} VND x {item.qty}
            <div>
              <button
                className={styles.button}
                onClick={() => updateQty(item.id, 1)}
                style={{ background: '#28a745', color: 'white' }}
              >+</button>
              <button
                className={styles.button}
                onClick={() => updateQty(item.id, -1)}
                style={{ background: '#28a745', color: 'white' }}
              >-</button>
              <button
                className={styles.buttonDanger}
                onClick={() => removeFromCart(item.id)}
                style={{ background: '#dc3545', color: 'white' }}
              >Xóa</button>
            </div>
          </div>
        ))}
        <h3>Tổng cộng: {total} VND</h3>
        <button
          className={`${styles.button} ${styles.checkoutButton}`}
          onClick={() => navigate('/checkout')}
          style={{ color: 'white' }}
        >Thanh toán</button>
      </div>
    </div>
  );
}