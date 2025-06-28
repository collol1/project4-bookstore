const Order = require('../models/Order');
const Book = require('../models/Book');
const OrderItem = require('../models/OrderItem');

// @desc    Get sales statistics
// @route   GET /api/stats/sales
exports.getSalesStats = async (req, res) => {
  try {
    const [dailyStats, monthlyStats, bestSellingBooks] = await Promise.all([
      OrderItem.getDailySales(),
      OrderItem.getMonthlySales(),
      OrderItem.getBestSellingBooks(5)
    ]);

    res.json({
      success: true,
      data: {
        daily: dailyStats,
        monthly: monthlyStats,
        bestSelling: bestSellingBooks
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Get inventory stats
// @route   GET /api/stats/inventory
exports.getInventoryStats = async (req, res) => {
  try {
    const [lowStockBooks, categoryStock] = await Promise.all([
      Book.findLowStock(5),
      Book.getStockByCategory()
    ]);

    res.json({
      success: true,
      data: {
        lowStock: lowStockBooks,
        categoryStock
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};