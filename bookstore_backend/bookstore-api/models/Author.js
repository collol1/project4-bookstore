const pool = require('../config/db');

class Author {
  static async create({ name, biography, birth_date, image_url }) {
    const [result] = await pool.execute(
      'INSERT INTO Authors (id, name, biography, birth_date, image_url) VALUES (UUID(), ?, ?, ?, ?)',
      [name, biography, birth_date, image_url]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM Authors'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM Authors WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async update(id, { name, biography, birth_date, image_url }) {
    const [result] = await pool.execute(
      'UPDATE Authors SET name = ?, biography = ?, birth_date = ?, image_url = ? WHERE id = ?',
      [name, biography, birth_date, image_url, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM Authors WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }
}

module.exports = Author;