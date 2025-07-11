const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const { idValidation, bookValidation, paginationValidation } = require('../middlewares/validationMiddleware');
const Book = require('../models/Book');

router.get('/', paginationValidation, bookController.getAllBooks);
router.post('/', authenticate, authorizeAdmin, bookValidation, bookController.createBook);
router.get('/:id', idValidation, bookController.getBookById);
// Lấy sách theo tác giả
router.get('/by-author/:authorId', async (req, res) => {
  try {
    const books = await Book.findByAuthor(req.params.authorId);
    res.json({ 
      success: true,
      data: books 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});
// Lấy sách theo thể loại
router.get('/by-category/:categoryId', async (req, res) => {
  try {
    const books = await Book.findByCategory(req.params.categoryId);
    res.json({ 
      success: true,
      data: books 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});
router.put('/:id', authenticate, authorizeAdmin, idValidation, bookValidation, bookController.updateBook);
router.delete('/:id', authenticate, authorizeAdmin, idValidation, bookController.deleteBook);
router.post('/:id/images', authenticate, authorizeAdmin, idValidation, bookController.addBookImage);
router.put('/:id/images/primary', authenticate, authorizeAdmin, idValidation, bookController.setPrimaryBookImage);

module.exports = router;