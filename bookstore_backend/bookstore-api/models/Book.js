const pool = require('../config/db');

class Book {
  static async create({ title, author_id, description, price, category_id, stock, image_url, published_date, isbn }) {
    const [result] = await pool.execute(
      `INSERT INTO Books (id, title, author_id, description, price, category_id, stock, image_url, published_date, isbn) 
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, author_id, description, price, category_id, stock, image_url, published_date, isbn]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute(
      `SELECT b.*, a.name as author_name, c.name as category_name 
       FROM Books b 
       JOIN Authors a ON b.author_id = a.id 
       LEFT JOIN Categories c ON b.category_id = c.id`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT b.*, a.name as author_name, c.name as category_name 
       FROM Books b 
       JOIN Authors a ON b.author_id = a.id 
       LEFT JOIN Categories c ON b.category_id = c.id 
       WHERE b.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async update(id, { title, author_id, description, price, category_id, stock, image_url, published_date, isbn }) {
    const [result] = await pool.execute(
      `UPDATE Books 
       SET title = ?, author_id = ?, description = ?, price = ?, category_id = ?, stock = ?, image_url = ?, published_date = ?, isbn = ? 
       WHERE id = ?`,
      [title, author_id, description, price, category_id, stock, image_url, published_date, isbn, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM Books WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }

  static async findByCategory(categoryId) {
    const [rows] = await pool.execute(
      'SELECT * FROM Books WHERE category_id = ?',
      [categoryId]
    );
    return rows;
  }

  static async findByAuthor(authorId) {
    const [rows] = await pool.execute(
      'SELECT * FROM Books WHERE author_id = ?',
      [authorId]
    );
    return rows;
  }
}

module.exports = Book;