const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default || require('rate-limit-redis');
const redisClient = require('../config/redis');

// If Redis is not ready, we will not use the store option when running rateLimit.
// Actually, it's safer to just provide new instances inline.

// Rate Limiter for general API endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    standardHeaders: true, 
    legacyHeaders: false, 
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    })
});

// Stricter Rate Limiter for feedback submissions
const feedbackSubmissionLimiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    max: 10, // Limit each IP to 10 feedback submissions per 3 minutes
    message: 'Too many feedback submissions from this IP, please try again after 3 minutes',
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    })
});

// Wrapper middlewares to bypass if Redis is not connected
const apiLimiterMiddleware = (req, res, next) => {
    if (!redisClient.isReady) {
        return next();
    }
    return apiLimiter(req, res, next);
};

const feedbackSubmissionLimiterMiddleware = (req, res, next) => {
    if (!redisClient.isReady) {
        return next();
    }
    return feedbackSubmissionLimiter(req, res, next);
};

module.exports = {
    apiLimiter: apiLimiterMiddleware,
    feedbackSubmissionLimiter: feedbackSubmissionLimiterMiddleware
};
