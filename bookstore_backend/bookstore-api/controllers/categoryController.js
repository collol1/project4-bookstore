const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Create a category (admin only)
// @route   POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image_url } = req.body;
    
    // Check if category exists
    const existingCategory = await Category.findByName(name);
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const categoryId = await Category.create({ name, description, image_url });
    const newCategory = await Category.findById(categoryId);

    res.status(201).json({
      success: true,
      data: newCategory
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Update category (admin only)
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description, image_url } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const affectedRows = await Category.update(categoryId, { name, description, image_url });
    if (affectedRows === 0) {
      return res.status(400).json({ error: 'Update failed' });
    }

    const updatedCategory = await Category.findById(categoryId);
    res.json({
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Delete category (admin only)
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const affectedRows = await Category.delete(categoryId);
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};