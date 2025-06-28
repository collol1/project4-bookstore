const pool = require('../config/db');

class BookImage {
  static async create({ bookId, imageUrl, isPrimary = false }) {
    const [result] = await pool.execute(
      'INSERT INTO BookImages (id, book_id, image_url, is_primary) VALUES (UUID(), ?, ?, ?)',
      [bookId, imageUrl, isPrimary]
    );
    return result.insertId;
  }

  static async findByBookId(bookId) {
    const [rows] = await pool.execute(
      'SELECT * FROM BookImages WHERE book_id = ?',
      [bookId]
    );
    return rows;
  }

  static async setPrimaryImage(bookId, imageId) {
    // Reset all primary images for this book
    await pool.execute(
      'UPDATE BookImages SET is_primary = FALSE WHERE book_id = ?',
      [bookId]
    );

    // Set the new primary image
    const [result] = await pool.execute(
      'UPDATE BookImages SET is_primary = TRUE WHERE id = ? AND book_id = ?',
      [imageId, bookId]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM BookImages WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }
}

module.exports = BookImage;