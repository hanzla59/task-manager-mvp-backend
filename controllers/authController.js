const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const pool = require('../config/db');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../services/jwtServices')
require('dotenv').config({ quiet: true });
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(4).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(32).required()
})

// Register a new user
const register = async (req, res) => {
  const client = await pool.connect();
  try {
    const { error, value } = registerSchema.validate({ name, email, password });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { name, email, password } = value;

    await client.query('BEGIN');
    // Check if user exists
    const existingUser = await User.findByEmail(email, client);
    if (existingUser) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create(name, email, password, client);
    if (!user) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'User creation failed' });
    }

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    if (!accessToken || !refreshToken) {
      await client.query('ROLLBACK');
      return res.status(500).json({ message: 'Token generation failed' });
    }

    const token = await Token.create(user.id, refreshToken, client);
    if (!token) {
      await client.query('ROLLBACK');
      return res.status(500).json({ message: 'Token storage failed' });
    }

    await client.query('COMMIT');
    res.status(201).json({ user: { name: user.name, email: user.email }, accessToken, refreshToken });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
};


const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(32).required()
})

// Login user
const login = async (req, res) => {
  const client = await pool.connect();
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = value;
    await client.query('BEGIN');
    const user = await User.findByEmail(email, client);
    if (!user) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const bcrypt = require('bcrypt');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    if (!accessToken || !refreshToken) {
      await client.query('ROLLBACK');
      return res.status(500).json({ message: 'Token generation failed' });
    }

    const token = await Token.create(user.id, refreshToken, client);
    if (!token) {
      await client.query('ROLLBACK');
      return res.status(500).json({ message: 'Token storage failed' });
    }

    await client.query('COMMIT');
    res.status(200).json({ user: { name: user.name, email: user.email }, accessToken, refreshToken });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
};

// Refresh access token
const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: 'Refresh token required' });
  const client = await pool.connect();
  try {
    // Check if token exists in DB
    await client.query('BEGIN');
    const result = await Token.find(token, client);
    if (!result) {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Verify token
    const decoded = await verifyRefreshToken(token);
    if (!decoded) {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    const accessToken = await generateAccessToken({ id: decoded.id });
    const newRefreshToken = await generateRefreshToken({ id: decoded.id });
    const token = await Token.updateToken(result.id, newRefreshToken, client);
    if (!token) {
      await client.query('ROLLBACK');
      return res.status(500).json({ message: 'Token update failed' });
    }
    await client.query('COMMIT');
    res.status(200).json({ accessToken: accessToken, refreshToken: newRefreshToken });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
  finally {
    client.release();
  }
};

// Logout user (delete refresh token)
const logout = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Token required' });

  try {
    try {
      await verifyRefreshToken(token);
    } catch (error) {
      return res.status(403).json({ message: 'Invalid or Expired token' });
    }
    const deletedToken = await Token.find(token);
    if (!deletedToken) return res.status(403).json({ message: 'token not found' });
    await Token.delete(token);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, refreshToken, logout };
