import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

export default function Checkout() {
  const nav = useNavigate();
  const [form, setForm] = useState({ shipping_address:'', payment_method:'cash_on_delivery' });
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);

  const handleSubmit = async e => {
    e.preventDefault();
    const order = {
      total_price: total,
      shipping_address: form.shipping_address,
      payment_method: form.payment_method,
      items: cart.map(i=>({ book_id: i.id, quantity: i.qty, price_at_purchase: i.price })),
    };
    await api.post('/orders', order);
    localStorage.removeItem('cart');
    // alert('Order placed');
    nav('/', { state: { message: 'Đặt hàng thành công! Bạn có thể tiếp tục mua sắm.' } });
    // nav('/');
  };

  return (
    <div style={{ padding:20 }}>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            placeholder="Shipping Address"
            value={form.shipping_address}
            onChange={e=>setForm({...form,shipping_address:e.target.value})}
            required
          />
        </div>
        <div style={{ marginTop:10 }}>
          <select
            value={form.payment_method}
            onChange={e=>setForm({...form,payment_method:e.target.value})}
          >
            <option value="cash_on_delivery">COD</option>
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>
        <button style={{ marginTop:20, background: '#4CAF50', color: 'red' }} type="submit" url="http://localhost:3000">Place Order</button>
      </form>
    </div>
  );
}
