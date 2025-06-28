const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { 
      totalPrice, 
      paymentMethod, 
      shippingAddress, 
      billingAddress, 
      contactPhone, 
      notes,
      items 
    } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }

    const orderId = await Order.create({
      userId: req.user.id,
      totalPrice,
      paymentMethod,
      shippingAddress,
      billingAddress,
      contactPhone,
      notes,
      items
    });

    const order = await Order.findById(orderId);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error: ' + error.message 
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the user is the owner or admin
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to access this order' });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findByUser(req.user.id);
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, paymentStatus, userId } = req.query;
    const orders = await Order.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      paymentStatus,
      userId
    });

    res.json({
      success: true,
      ...orders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const affectedRows = await Order.updateStatus(orderId, status);
    if (affectedRows === 0) {
      return res.status(400).json({ error: 'Update failed' });
    }

    const order = await Order.findById(orderId);
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Update payment status (admin only)
// @route   PUT /api/orders/:id/payment-status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { paymentStatus, paymentDate, transactionId } = req.body;

    const affectedRows = await Order.updatePaymentStatus(
      orderId, 
      paymentStatus, 
      paymentDate, 
      transactionId
    );
    
    if (affectedRows === 0) {
      return res.status(400).json({ error: 'Update failed' });
    }

    const order = await Order.findById(orderId);
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Check if the order belongs to the user or user is admin
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to cancel this order' });
    }

    const success = await Order.cancelOrder(orderId);
    if (!success) {
      return res.status(400).json({ error: 'Cancel order failed' });
    }

    const updatedOrder = await Order.findById(orderId);
    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Get order statistics (admin only)
// @route   GET /api/orders/stats
exports.getOrderStats = async (req, res) => {
  try {
    const stats = await Order.getStatistics();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};