const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const { idValidation } = require('../middlewares/validationMiddleware');

router.get('/', authenticate, authorizeAdmin, userController.getAllUsers);
router.get('/:id', authenticate, authorizeAdmin, idValidation, userController.getUserById);
router.put('/:id', authenticate, authorizeAdmin, idValidation, userController.updateUser);
router.delete('/:id', authenticate, authorizeAdmin, idValidation, userController.deleteUser);

module.exports = router;