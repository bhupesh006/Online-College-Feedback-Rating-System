const rateLimit = require('express-rate-limit');

// Rate Limiter for general API endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    standardHeaders: true, 
    legacyHeaders: false, 
});

// Stricter Rate Limiter for feedback submissions
const feedbackSubmissionLimiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    max: 10, // Limit each IP to 10 feedback submissions per 3 minutes
    message: 'Too many feedback submissions from this IP, please try again after 3 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    feedbackSubmissionLimiter
};
