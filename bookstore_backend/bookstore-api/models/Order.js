const pool = require('../config/db');
const uuid = require('uuid');
const OrderItem = require('./OrderItem');

class Order {
  /**
   * Tạo đơn hàng mới
   * @param {Object} orderData - Dữ liệu đơn hàng
   * @param {Array} items - Danh sách sản phẩm trong đơn hàng
   * @returns {string} ID của đơn hàng mới tạo
   */
  static async create({ 
    userId, 
    totalPrice, 
    paymentMethod, 
    shippingAddress, 
    billingAddress = null, 
    contactPhone, 
    notes = null, 
    items 
  }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Tạo ID đơn hàng mới
      const orderId = uuid.v4();
      
      // Tạo đơn hàng
      await connection.execute(
        `INSERT INTO Orders (id, user_id, total_price, payment_method, shipping_address, billing_address, contact_phone, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId, 
          userId, 
          totalPrice, 
          paymentMethod, 
          shippingAddress, 
          billingAddress || shippingAddress, 
          contactPhone, 
          notes
        ]
      );

      // Thêm các mục hàng vào đơn
      for (const item of items) {
        await OrderItem.create(
          orderId, 
          item.bookId, 
          item.quantity,  
          item.price,
          connection
        );
        
        // Cập nhật tồn kho sách
        await connection.execute(
          'UPDATE Books SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.bookId]
        );
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Lấy chi tiết đơn hàng theo ID
   * @param {string} id - ID đơn hàng
   * @returns {Object|null} Thông tin đơn hàng hoặc null nếu không tìm thấy
   */
  static async findById(id) {
    const [orderRows] = await pool.execute(
      `SELECT o.*, u.username, u.email 
       FROM Orders o
       JOIN Users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [id]
    );
    
    if (orderRows.length === 0) return null;

    const items = await OrderItem.findByOrderId(id);
    
    return {
      ...orderRows[0],
      items
    };
  }

  /**
   * Lấy tất cả đơn hàng của một người dùng
   * @param {string} userId - ID người dùng
   * @returns {Array} Danh sách đơn hàng
   */
  static async findByUser(userId) {
    const [orderRows] = await pool.execute(
      'SELECT * FROM Orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    const orders = await Promise.all(
      orderRows.map(async (order) => {
        const items = await OrderItem.findByOrderId(order.id);
        return {
          ...order,
          items
        };
      })
    );

    return orders;
  }

  /**
   * Lấy tất cả đơn hàng (cho admin)
   * @param {Object} options - Tùy chọn phân trang và lọc
   * @returns {Object} Kết quả phân trang
   */
  static async findAll({ 
    page = 1, 
    limit = 10, 
    status = null, 
    paymentStatus = null,
    userId = null
  } = {}) {
    const offset = (page - 1) * limit;
    
    // Xây dựng điều kiện WHERE
    const whereClauses = [];
    const params = [];
    
    if (status) {
      whereClauses.push('o.status = ?');
      params.push(status);
    }
    
    if (paymentStatus) {
      whereClauses.push('o.payment_status = ?');
      params.push(paymentStatus);
    }
    
    if (userId) {
      whereClauses.push('o.user_id = ?');
      params.push(userId);
    }
    
    const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    // Lấy tổng số bản ghi
    const [totalResult] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM Orders o
       ${where}`,
      params
    );
    const total = totalResult[0].total;
    
    // Lấy dữ liệu đơn hàng
    params.push(limit, offset);
    const [orderRows] = await pool.execute(
      `SELECT o.*, u.username, u.email 
       FROM Orders o
       JOIN Users u ON o.user_id = u.id
       ${where}
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );
    
    // Lấy chi tiết sản phẩm cho từng đơn hàng
    const orders = await Promise.all(
      orderRows.map(async (order) => {
        const items = await OrderItem.findByOrderId(order.id);
        return {
          ...order,
          items
        };
      })
    );
    
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      orders
    };
  }

  /**
   * Cập nhật trạng thái đơn hàng
   * @param {string} id - ID đơn hàng
   * @param {string} status - Trạng thái mới
   * @returns {number} Số hàng bị ảnh hưởng
   */
  static async updateStatus(id, status) {
    const [result] = await pool.execute(
      'UPDATE Orders SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows;
  }

  /**
   * Cập nhật trạng thái thanh toán
   * @param {string} id - ID đơn hàng
   * @param {string} paymentStatus - Trạng thái thanh toán mới
   * @param {Date} paymentDate - Ngày thanh toán
   * @param {string} transactionId - ID giao dịch
   * @returns {number} Số hàng bị ảnh hưởng
   */
  static async updatePaymentStatus(id, paymentStatus, paymentDate = null, transactionId = null) {
    const [result] = await pool.execute(
      `UPDATE Orders 
       SET payment_status = ?, payment_date = ?, transaction_id = ? 
       WHERE id = ?`,
      [paymentStatus, paymentDate, transactionId, id]
    );
    return result.affectedRows;
  }

  /**
   * Hủy đơn hàng và hoàn trả số lượng sách
   * @param {string} orderId - ID đơn hàng
   * @returns {boolean} Thành công hay không
   */
  static async cancelOrder(orderId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Lấy trạng thái hiện tại của đơn hàng
      const [order] = await connection.execute(
        'SELECT status, payment_status FROM Orders WHERE id = ? FOR UPDATE',
        [orderId]
      );
      
      if (order.length === 0) {
        throw new Error('Order not found');
      }

      // Chỉ hủy nếu đơn hàng chưa được giao hoặc chưa xử lý xong
      if (!['pending', 'processing'].includes(order[0].status)) {
        throw new Error('Cannot cancel order in current status');
      }

      // Cập nhật trạng thái đơn hàng thành 'cancelled'
      await connection.execute(
        'UPDATE Orders SET status = ? WHERE id = ?',
        ['cancelled', orderId]
      );

      // Nếu đã thanh toán, cập nhật trạng thái thanh toán thành 'refunded'
      if (order[0].payment_status === 'paid') {
        await connection.execute(
          `UPDATE Orders 
           SET payment_status = 'refunded' 
           WHERE id = ?`,
          [orderId]
        );
      }

      // Lấy tất cả các mục hàng trong đơn
      const items = await OrderItem.findByOrderId(orderId, connection);

      // Hoàn trả số lượng sách
      for (const item of items) {
        await connection.execute(
          'UPDATE Books SET stock = stock + ? WHERE id = ?',
          [item.quantity, item.book_id]
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Lấy thống kê đơn hàng
   * @returns {Object} Các thống kê về đơn hàng
   */
  static async getStatistics() {
    // Thống kê theo trạng thái
    const [statusStats] = await pool.execute(
      `SELECT status, COUNT(*) as count 
       FROM Orders 
       GROUP BY status`
    );
    
    // Thống kê theo phương thức thanh toán
    const [paymentMethodStats] = await pool.execute(
      `SELECT payment_method, COUNT(*) as count 
       FROM Orders 
       GROUP BY payment_method`
    );
    
    // Thống kê theo trạng thái thanh toán
    const [paymentStatusStats] = await pool.execute(
      `SELECT payment_status, COUNT(*) as count 
       FROM Orders 
       GROUP BY payment_status`
    );
    
    // Doanh thu theo tháng
    const [monthlyRevenue] = await pool.execute(
      `SELECT 
         DATE_FORMAT(created_at, '%Y-%m') as month,
         SUM(total_price) as revenue
       FROM Orders
       WHERE payment_status = 'paid'
       GROUP BY month
       ORDER BY month DESC
       LIMIT 12`
    );
    
    // Tổng doanh thu
    const [totalRevenueResult] = await pool.execute(
      `SELECT SUM(total_price) as total_revenue
       FROM Orders
       WHERE payment_status = 'paid'`
    );
    
    return {
      statusStats,
      paymentMethodStats,
      paymentStatusStats,
      monthlyRevenue,
      totalRevenue: totalRevenueResult[0].total_revenue || 0
    };
  }
}

module.exports = Order;