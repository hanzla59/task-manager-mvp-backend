const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout } = require('../controllers/authController');

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Refresh access token
router.post('/refresh-token', refreshToken);

// Logout user
router.post('/logout', logout);

module.exports = router;
