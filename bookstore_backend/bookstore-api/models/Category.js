const pool = require('../config/db');

class Category {
  static async create({ name, description, image_url }) {
    const [result] = await pool.execute(
      'INSERT INTO Categories (id, name, description, image_url) VALUES (UUID(), ?, ?, ?)',
      [name, description, image_url]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM Categories'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM Categories WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async update(id, { name, description, image_url }) {
    const [result] = await pool.execute(
      'UPDATE Categories SET name = ?, description = ?, image_url = ? WHERE id = ?',
      [name, description, image_url, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM Categories WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }
}

module.exports = Category;