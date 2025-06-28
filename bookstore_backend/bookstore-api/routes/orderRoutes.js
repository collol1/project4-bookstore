const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const { idValidation, orderValidation, paginationValidation } = require('../middlewares/validationMiddleware');

router.post('/', authenticate, orderValidation, orderController.createOrder);
router.get('/my-orders', authenticate, orderController.getMyOrders);
router.get('/:id', authenticate, idValidation, orderController.getOrderById);
router.get('/', authenticate, authorizeAdmin, paginationValidation, orderController.getAllOrders);
router.put('/:id/status', authenticate, authorizeAdmin, idValidation, orderController.updateOrderStatus);
router.put('/:id/payment-status', authenticate, authorizeAdmin, idValidation, orderController.updatePaymentStatus);
router.put('/:id/cancel', authenticate, idValidation, orderController.cancelOrder);
router.get('/stats', authenticate, authorizeAdmin, orderController.getOrderStats);

module.exports = router;