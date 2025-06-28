const { body, param, query } = require('express-validator');

// Validation cho đăng ký người dùng
const registerValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Validation cho tạo sách
const bookValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('author_id').notEmpty().withMessage('Author ID is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

// Validation cho tạo đơn hàng
const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.bookId').notEmpty().withMessage('Book ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('contactPhone').notEmpty().withMessage('Contact phone is required')
];

// Validation ID
const idValidation = [
  param('id').isUUID().withMessage('Invalid ID format')
];

// Validation phân trang
const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

module.exports = {
  registerValidation,
  bookValidation,
  orderValidation,
  idValidation,
  paginationValidation
};