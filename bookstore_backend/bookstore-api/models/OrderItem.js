const pool = require('../config/db');

class OrderItem {
  /**
   * Tìm các mục hàng theo ID đơn hàng
   * @param {string} orderId - ID đơn hàng
   * @param {Object} [connection] - Kết nối database (dùng cho transaction)
   * @returns {Array} Danh sách mục hàng
   */
  static async findByOrderId(orderId, connection = null) {
    const query = `
      SELECT 
        oi.*, 
        b.title, 
        b.image_url, 
        a.name as author_name,
        c.name as category_name
      FROM OrderItems oi 
      JOIN Books b ON oi.book_id = b.id
      JOIN Authors a ON b.author_id = a.id
      LEFT JOIN Categories c ON b.category_id = c.id
      WHERE oi.order_id = ?`;
    
    if (connection) {
      const [rows] = await connection.execute(query, [orderId]);
      return rows;
    }
    
    const [rows] = await pool.execute(query, [orderId]);
    return rows;
  }

  /**
   * Tạo mục hàng mới
   * @param {string} orderId - ID đơn hàng
   * @param {string} bookId - ID sách
   * @param {number} quantity - Số lượng
   * @param {number} priceAtPurchase - Giá tại thời điểm mua
   * @param {Object} [connection] - Kết nối database (dùng cho transaction)
   * @returns {number} ID của mục hàng mới tạo
   */
  static async create(orderId, bookId, quantity, priceAtPurchase, connection = null) {
    const query = `
      INSERT INTO OrderItems (id, order_id, book_id, quantity, price_at_purchase)
      VALUES (UUID(), ?, ?, ?, ?)`;
    
    if (connection) {
      const [result] = await connection.execute(query, [orderId, bookId, quantity, priceAtPurchase]);
      return result.insertId;
    }
    
    const [result] = await pool.execute(query, [orderId, bookId, quantity, priceAtPurchase]);
    return result.insertId;
  }

  /**
   * Xóa các mục hàng theo ID đơn hàng
   * @param {string} orderId - ID đơn hàng
   * @param {Object} [connection] - Kết nối database (dùng cho transaction)
   * @returns {number} Số hàng bị ảnh hưởng
   */
  static async deleteByOrderId(orderId, connection = null) {
    const query = 'DELETE FROM OrderItems WHERE order_id = ?';
    
    if (connection) {
      const [result] = await connection.execute(query, [orderId]);
      return result.affectedRows;
    }
    
    const [result] = await pool.execute(query, [orderId]);
    return result.affectedRows;
  }

  /**
   * Thống kê bán hàng
   * @returns {Array} Thống kê bán hàng theo sách
   */
  static async getSalesStatistics() {
    const [rows] = await pool.execute(
      `SELECT 
         b.id AS book_id,
         b.title,
         SUM(oi.quantity) AS total_sold,
         SUM(oi.quantity * oi.price_at_purchase) AS total_revenue,
         a.name AS author_name,
         c.name AS category_name
       FROM OrderItems oi
       JOIN Books b ON oi.book_id = b.id
       JOIN Orders o ON oi.order_id = o.id
       JOIN Authors a ON b.author_id = a.id
       LEFT JOIN Categories c ON b.category_id = c.id
       WHERE o.payment_status = 'paid'
       GROUP BY b.id
       ORDER BY total_sold DESC, total_revenue DESC
       LIMIT 10`
    );
    return rows;
  }

  /**
   * Thống kê bán hàng theo danh mục
   * @returns {Array} Thống kê bán hàng theo danh mục
   */
  static async getCategorySales() {
    const [rows] = await pool.execute(
      `SELECT 
         c.id AS category_id,
         c.name AS category_name,
         COALESCE(SUM(oi.quantity), 0) AS total_sold,
         COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0) AS total_revenue
       FROM Categories c
       LEFT JOIN Books b ON c.id = b.category_id
       LEFT JOIN OrderItems oi ON b.id = oi.book_id
       LEFT JOIN Orders o ON oi.order_id = o.id AND o.payment_status = 'paid'
       GROUP BY c.id
       ORDER BY total_revenue DESC`
    );
    return rows;
  }

  /**
   * Lấy sách bán chạy nhất
   * @param {number} limit - Số lượng kết quả trả về
   * @returns {Array} Danh sách sách bán chạy
   */
  static async getBestSellingBooks(limit = 5) {
    const [rows] = await pool.execute(
      `SELECT 
         b.id,
         b.title,
         b.image_url,
         a.name as author_name,
         SUM(oi.quantity) as total_sold
       FROM OrderItems oi
       JOIN Books b ON oi.book_id = b.id
       JOIN Authors a ON b.author_id = a.id
       JOIN Orders o ON oi.order_id = o.id
       WHERE o.payment_status = 'paid'
       GROUP BY b.id
       ORDER BY total_sold DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  }
}

module.exports = OrderItem;