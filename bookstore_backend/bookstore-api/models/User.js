const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
 static async create({ username, email, password, role = 'user' }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.execute(
    'INSERT INTO Users (id, username, email, password, role) VALUES (UUID(), ?, ?, ?, ?)',
    [username, email, hashedPassword, role]
  );
  return result;
}

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM Users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM Users'
    );
    return rows;
  }

  static async update(id, { username, email, role }) {
    const [result] = await pool.execute(
      'UPDATE Users SET username = ?, email = ?, role = ? WHERE id = ?',
      [username, email, role, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM Users WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }
}

module.exports = User;