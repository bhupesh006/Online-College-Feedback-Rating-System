const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default || require('rate-limit-redis');
const redisClient = require('../config/redis');

// Fallback to MemoryStore if Redis is not configured
const useRedis = !!process.env.REDIS_URL;

const storeConfig = useRedis ? {
    store: new RedisStore({
    sendCommand: async (...args) => {
        try {
            return await redisClient.sendCommand(args);
        } catch (err) {
            console.error('Redis Rate Limiter Error:', err);
            // Returning undefined or throwing here allows rate-limiter to potentially fallback or fail-open depending on config
            // But with express-rate-limit, if the store fails, it often hangs unless handled.
            return null; 
        }
    },
    })
} : {};

// Rate Limiter for general API endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    standardHeaders: true, 
    legacyHeaders: false, 
    ...storeConfig
});

// Stricter Rate Limiter for feedback submissions
const feedbackSubmissionLimiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    max: 10, // Limit each IP to 10 feedback submissions per 3 minutes
    message: 'Too many feedback submissions from this IP, please try again after 3 minutes',
    standardHeaders: true,
    legacyHeaders: false,
    ...storeConfig
});

module.exports = {
    apiLimiter,
    feedbackSubmissionLimiter
};
