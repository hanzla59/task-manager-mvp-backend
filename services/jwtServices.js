const jwt = require('jsonwebtoken');
require('dotenv').config({ quiet: true });


// Generate Access Token
const generateAccessToken = async (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30m' }); // 30 min
};

//verify access token 
const verifyAccessToken = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
}

// Generate Refresh Token
const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return refreshToken;
};

const verifyRefreshToken = async (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}


module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };

