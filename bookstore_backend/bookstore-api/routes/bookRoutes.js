const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const { idValidation, bookValidation, paginationValidation } = require('../middlewares/validationMiddleware');

router.get('/', paginationValidation, bookController.getAllBooks);
router.post('/', authenticate, authorizeAdmin, bookValidation, bookController.createBook);
router.get('/:id', idValidation, bookController.getBookById);
router.put('/:id', authenticate, authorizeAdmin, idValidation, bookValidation, bookController.updateBook);
router.delete('/:id', authenticate, authorizeAdmin, idValidation, bookController.deleteBook);
router.post('/:id/images', authenticate, authorizeAdmin, idValidation, bookController.addBookImage);
router.put('/:id/images/primary', authenticate, authorizeAdmin, idValidation, bookController.setPrimaryBookImage);

module.exports = router;