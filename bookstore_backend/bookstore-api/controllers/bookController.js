const Book = require('../models/Book');
const BookImage = require('../models/BookImage');

// @desc    Get all books
// @route   GET /api/books
// Sửa hàm getAllBooks
exports.getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, author, search } = req.query;
    
    // Sửa: Thêm data vào response
    const books = await Book.findAll({ 
      page: parseInt(page), 
      limit: parseInt(limit), 
      category, 
      author, 
      search 
    });

    res.json({
      success: true,
      data: books // Trả về mảng books trong thuộc tính data
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Create a book (admin only)
// @route   POST /api/books
exports.createBook = async (req, res) => {
  try {
    const { 
      title, 
      author_id, 
      description, 
      price, 
      category_id, 
      stock, 
      image_url, 
      published_date, 
      isbn 
    } = req.body;

    const bookId = await Book.create({ 
      title, 
      author_id, 
      description, 
      price, 
      category_id, 
      stock, 
      image_url, 
      published_date, 
      isbn 
    });

    const newBook = await Book.findById(bookId);
    res.status(201).json({
      success: true,
      data: newBook
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
exports.getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Get book images
    const images = await BookImage.findByBookId(bookId);
    book.images = images;

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Update book (admin only)
// @route   PUT /api/books/:id
exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { 
      title, 
      author_id, 
      description, 
      price, 
      category_id, 
      stock, 
      image_url, 
      published_date, 
      isbn 
    } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const affectedRows = await Book.update(bookId, { 
      title, 
      author_id, 
      description, 
      price, 
      category_id, 
      stock, 
      image_url, 
      published_date, 
      isbn 
    });

    if (affectedRows === 0) {
      return res.status(400).json({ error: 'Update failed' });
    }

    const updatedBook = await Book.findById(bookId);
    res.json({
      success: true,
      data: updatedBook
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Delete book (admin only)
// @route   DELETE /api/books/:id
exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const affectedRows = await Book.delete(bookId);
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Add image to book
// @route   POST /api/books/:id/images
exports.addBookImage = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { image_url, is_primary } = req.body;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const imageId = await BookImage.create({ 
      bookId, 
      imageUrl: image_url, 
      isPrimary: is_primary || false 
    });

    // If this image is primary, update book's primary image
    if (is_primary) {
      await BookImage.setPrimaryImage(bookId, imageId);
    }

    res.status(201).json({
      success: true,
      message: 'Image added successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Set primary image for a book
// @route   PUT /api/books/:id/images/primary
exports.setPrimaryBookImage = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { image_id } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const affectedRows = await BookImage.setPrimaryImage(bookId, image_id);
    if (affectedRows === 0) {
      return res.status(400).json({ error: 'Set primary image failed' });
    }

    res.json({
      success: true,
      message: 'Primary image set successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};      