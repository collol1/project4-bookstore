const Author = require('../models/Author');

// @desc    Get all authors
// @route   GET /api/authors
exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.findAll();
    res.json({
      success: true,
      count: authors.length,
      data: authors
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Create an author (admin only)
// @route   POST /api/authors
exports.createAuthor = async (req, res) => {
  try {
    const { name, biography, birth_date, image_url } = req.body;
    const authorId = await Author.create({ name, biography, birth_date, image_url });
    const newAuthor = await Author.findById(authorId);

    res.status(201).json({
      success: true,
      data: newAuthor
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Get single author
// @route   GET /api/authors/:id
exports.getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.json({
      success: true,
      data: author
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Update author (admin only)
// @route   PUT /api/authors/:id
exports.updateAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;
    const { name, biography, birth_date, image_url } = req.body;

    const author = await Author.findById(authorId);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const affectedRows = await Author.update(authorId, { name, biography, birth_date, image_url });
    if (affectedRows === 0) {
      return res.status(400).json({ error: 'Update failed' });
    }

    const updatedAuthor = await Author.findById(authorId);
    res.json({
      success: true,
      data: updatedAuthor
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Delete author (admin only)
// @route   DELETE /api/authors/:id
exports.deleteAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;
    const affectedRows = await Author.delete(authorId);
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.json({
      success: true,
      message: 'Author deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};