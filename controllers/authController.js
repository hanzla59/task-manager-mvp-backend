const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const Token = require('../models/tokenModel');
const { generateAccessToken, generateRefreshToken } = require('../services/jwtServices')
require('dotenv').config({ quiet: true });

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create(name, email, password);
    if (!user) {
      return res.status(400).json({ message: 'User creation failed' });
    }
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    await Token.create(user.id, refreshToken);


    res.status(201).json({ user: { name: user.name, email: user.email }, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const bcrypt = require('bcrypt');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    await Token.create(user.id, refreshToken);

    res.status(200).json({ user: { name: user.name, email: user.email }, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Refresh access token
const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: 'Refresh token required' });

  try {
    // Check if token exists in DB
    const result = await Token.find(token);
    if (!result) return res.status(403).json({ message: 'Invalid refresh token' });

    // Verify refresh token
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid refresh token' });

      const accessToken = await generateAccessToken({ id: decoded.id });
      res.status(200).json({ accessToken: accessToken });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout user (delete refresh token)
const logout = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Token required' });

  try {
    await Token.delete(token);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, refreshToken, logout };
