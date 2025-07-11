const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation } = require('../middlewares/validationMiddleware');
const { authenticate } = require('../middlewares/authMiddleware'); // Import bằng destructuring

// Sử dụng authenticate thay cho authMiddleware
router.get('/me', authenticate, authController.getMe); // ✅ Đã sửa
router.post('/register', registerValidation, authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;