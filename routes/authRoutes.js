const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout } = require('../controllers/authController');
const { LoginRateLimiter, RegisterRateLimiter } = require('../middleware/rateLimiter');

// Register a new user
router.post('/register', RegisterRateLimiter, register);

// Login user
router.post('/login', LoginRateLimiter, login);

// Refresh access token
router.post('/refresh-token', refreshToken);

// Logout user
router.post('/logout', logout);

module.exports = router;
