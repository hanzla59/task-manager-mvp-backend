const pool = require('../config/db');

const Token = {
  async create(userId, token, client = pool) {
    const result = await client.query(
      `INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2) RETURNING *`,
      [userId, token]
    );
    return result.rows[0];
  },

    async updateToken (id, newToken, client = pool){
    const result = await client.query(
      `UPDATE refresh_tokens SET token = $1 WHERE id = $2 RETURNING *`,
      [newToken, id]
    );
    return result.rows[0];
  },

  async find(token, client = pool) {
    const result = await client.query(
      `SELECT * FROM refresh_tokens WHERE token = $1`,
      [token]
    );
    return result.rows[0];
  },

  async delete(token, client = pool) {
    await client.query(`DELETE FROM refresh_tokens WHERE token = $1`, [token]);
  }
  
};

module.exports = Token;
