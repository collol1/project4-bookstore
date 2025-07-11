const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

// Tất cả routes đều yêu cầu xác thực
router.use(authenticate);

router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

// Các route admin yêu cầu quyền admin
router.use(authorizeAdmin);
router.get('/', orderController.getAllOrders);
router.put('/:id/status', orderController.updateOrderStatus);
router.put('/:id/payment-status', orderController.updatePaymentStatus);
router.get('/stats', orderController.getOrderStats);

// Hủy đơn hàng không yêu cầu admin
router.put('/:id/cancel', orderController.cancelOrder);

module.exports = router;