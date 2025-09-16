const pool = require('../config/db');

const Token = {
  async create(userId, token) {
    const result = await pool.query(
      `INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2) RETURNING *`,
      [userId, token]
    );
    return result.rows[0];
  },

    async updateToken (id, newToken){
    const result = await pool.query(
      `UPDATE refresh_tokens SET token = $1 WHERE id = $2 RETURNING *`,
      [newToken, id]
    );
    return result.rows[0];
  },

  async find(token) {
    const result = await pool.query(
      `SELECT * FROM refresh_tokens WHERE token = $1`,
      [token]
    );
    return result.rows[0];
  },

  async delete(token) {
    await pool.query(`DELETE FROM refresh_tokens WHERE token = $1`, [token]);
  }
  
};

module.exports = Token;
