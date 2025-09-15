const pool = require('./../config/db');
const bcrypt = require('bcrypt');


const User = {
    create: async (username, email, password)=> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        return result.rows[0];
    },
    findByEmail: async (email) => {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    },
    findById: async (id) => {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [id]

        );
        return result.rows[0];
    }
}

module.exports = User;