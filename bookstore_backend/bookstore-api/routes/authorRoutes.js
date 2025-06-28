const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const { idValidation } = require('../middlewares/validationMiddleware');

router.get('/', authorController.getAllAuthors);
router.post('/', authenticate, authorizeAdmin, authorController.createAuthor);
router.get('/:id', idValidation, authorController.getAuthorById);
router.put('/:id', authenticate, authorizeAdmin, idValidation, authorController.updateAuthor);
router.delete('/:id', authenticate, authorizeAdmin, idValidation, authorController.deleteAuthor);


module.exports = router;    