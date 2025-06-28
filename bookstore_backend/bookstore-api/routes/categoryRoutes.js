const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const { idValidation } = require('../middlewares/validationMiddleware');

router.get('/', categoryController.getAllCategories);
router.post('/', authenticate, authorizeAdmin, categoryController.createCategory);
router.get('/:id', idValidation, categoryController.getCategoryById);
router.put('/:id', authenticate, authorizeAdmin, idValidation, categoryController.updateCategory);
router.delete('/:id', authenticate, authorizeAdmin, idValidation, categoryController.deleteCategory);

module.exports = router;