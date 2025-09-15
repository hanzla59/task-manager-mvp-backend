const pool = require('../config/db');

const Task = {
  create: async (title, description, project_id, assigned_to, due_date) => {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, project_id, assigned_to, due_date) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, project_id, assigned_to, due_date]
    );
    return result.rows[0];
  },

  findByProject: async (project_id) => {
    const result = await pool.query(
      `SELECT * FROM tasks WHERE project_id = $1`,
      [project_id]
    );
    return result.rows;
  },

  updateStatus: async (id, status) => {
    const result = await pool.query(
      `UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query(
      `SELECT * FROM tasks WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query(
      `DELETE FROM tasks WHERE id = $1 RETURNING *`,
      [id]
    );
    return !!(result.rowCount);
  }
};

module.exports = Task;
