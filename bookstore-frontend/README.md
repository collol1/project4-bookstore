# Bookstore Frontend

## Setup

1. Clone và `cd bookstore-frontend`
2. Chạy `npm install`
3. Chỉnh `src/api/api.js` cho đúng `baseURL`
4. `npm start` để chạy ở `http://localhost:3000`

## Structure

- `src/api`: cấu hình Axios
- `src/context`: AuthContext (login/logout, thông tin user)
- `src/components`: Login, Navbar, PrivateRoute, các component chung
- `src/pages/Admin`: CRUD Books, Categories, Authors
- `src/pages/User`: Home, Detail, Cart, Checkout
- `src/App.js`: routes & layout
- `src/index.js`: entry point