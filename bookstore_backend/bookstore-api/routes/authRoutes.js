const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation } = require('../middlewares/validationMiddleware');

router.post('/register', registerValidation, authController.register);
router.post('/login', authController.login);
router.get('/me', authController.getMe);
        
module.exports = router;