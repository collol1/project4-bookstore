import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Admin/Dashboard';
import BookList from './pages/Admin/Books/BookList';
import BookForm from './pages/Admin/Books/BookForm';
import CategoryList from './pages/Admin/Categories/CategoryList';
import CategoryForm from './pages/Admin/Categories/CategoryForm';
import AuthorList from './pages/Admin/Authors/AuthorList';
import AuthorForm from './pages/Admin/Authors/AuthorForm';
import Home from './pages/User/Home';
import BookDetail from './pages/User/BookDetail';
import Cart from './pages/User/Cart';
import Checkout from './pages/User/Checkout';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './context/ThemeContext'; 

// import  css

import './assets/styles/BookList.css';


import { CartProvider } from './context/CartContext';
import CartPage from './pages/User/CartPage';

function App() {
  return (
    <CartProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/books/:id" element={<BookDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
              </Route>

              <Route element={<PrivateRoute roles={['admin']} />}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/books" element={<BookList />} />
                <Route path="/admin/books/new" element={<BookForm />} />
                <Route path="/admin/books/:id" element={<BookForm />} />
                <Route path="/admin/categories" element={<CategoryList />} />
                <Route path="/admin/categories/new" element={<CategoryForm />} />
                <Route path="/admin/categories/:id" element={<CategoryForm />} />
                <Route path="/admin/authors" element={<AuthorList />} />
                <Route path="/admin/authors/new" element={<AuthorForm />} />
                <Route path="/admin/authors/:id" element={<AuthorForm />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </CartProvider>
  );
}

export default App;
