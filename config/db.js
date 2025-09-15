const {Pool} = require('pg');
const dotenv = require('dotenv');
dotenv.config({quiet: true});


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

pool.connect().then(()=>{
    console.log("Connected to the database");
}).catch((err)=>{
    console.error("Database connection error", err.stack);
})

module.exports = pool;