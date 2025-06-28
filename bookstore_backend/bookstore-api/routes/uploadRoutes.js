const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

router.post('/', authenticate, authorizeAdmin, uploadController.uploadImage);

module.exports = router;