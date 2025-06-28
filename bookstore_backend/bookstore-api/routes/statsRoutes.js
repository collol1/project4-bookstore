const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

router.get('/sales', authenticate, authorizeAdmin, statsController.getSalesStats);
router.get('/inventory', authenticate, authorizeAdmin, statsController.getInventoryStats);

module.exports = router;