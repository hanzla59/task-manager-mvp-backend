const pool = require('./../config/db');
const bcrypt = require('bcrypt');


const User = {
    create: async (username, email, password, client = pool)=> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await client.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        return result.rows[0];
    },
    findByEmail: async (email, client = pool) => {
        const result = await client.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    },
    findById: async (id, client = pool) => {
        const result = await client.query(
            'SELECT * FROM users WHERE id = $1',
            [id]

        );
        return result.rows[0];
    }
}

module.exports = User;