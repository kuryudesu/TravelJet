// backend/models/userModel.js
const pool = require('../config/db');

const User = {
  async create(username, email, passwordHash) {
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );
    return { id: result.insertId, username, email };
  },

  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, created_at, avatar_url FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async updateById(id, fields) {
    const fieldEntries = Object.entries(fields);
      if (fieldEntries.length === 0) {
        return this.findById(id); // 如果沒有欄位，回傳原始用戶資料
      }
        
      const setClause = fieldEntries.map(([key, _]) => `${key} = ?`).join(', ');
      const values = fieldEntries.map(([_, value]) => value);
        
      const sql = `UPDATE users SET ${setClause} WHERE id = ?`;
      values.push(id);
        
      await pool.execute(sql, values);

      return this.findById(id);
  }, 
};



module.exports = User;