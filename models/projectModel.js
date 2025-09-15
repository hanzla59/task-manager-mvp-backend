const pool = require('../config/db');

const Project = {
  create: async (name, description, owner_id) => {
    const result = await pool.query(
      `INSERT INTO projects (name, description, owner_id) 
       VALUES ($1, $2, $3) RETURNING *`,
      [name, description, owner_id]
    );
    return result.rows[0];
  },

  findByOwner: async (owner_id) => {
    const result = await pool.query(
      `SELECT * FROM projects WHERE owner_id = $1`,
      [owner_id]
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      `SELECT * FROM projects WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },
  delete: async (id) => {
    const result = await pool.query(
      `DELETE FROM projects WHERE id = $1 RETURNING *`,
      [id]
    );
    return !!(result.rowCount);
  }
};

module.exports = Project;
