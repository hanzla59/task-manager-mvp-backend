const rateLimit = require('express-rate-limit');

const LoginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
})

const RegisterRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many accounts created from this IP, please try again after an hour'
})

module.exports = {
    LoginRateLimiter,
    RegisterRateLimiter
}