const redisClient = require('../config/redis');

// Middleware to check cache
const checkCache = (keyPrefix) => {
    return async (req, res, next) => {
        try {
            if (!redisClient.isReady) {
                return next(); // Skip cache if Redis isn't connected
            }
            
            // Generate a unique cache key based on prefix and request URL/query
            const cacheKey = `${keyPrefix}:${req.originalUrl}`;
            
            const cachedData = await redisClient.get(cacheKey);
            
            if (cachedData) {
                // If Cache exists, return immediately
                return res.json(JSON.parse(cachedData));
            }
            
            // If Cache does not exist, attach a helper function to res.send to cache the response
            // This is a common pattern for Express caching
            const originalJson = res.json.bind(res);
            res.json = (body) => {
                if (redisClient.isReady) {
                    redisClient.setEx(cacheKey, 3600, JSON.stringify(body)).catch(err => console.error(err));
                }
                originalJson(body);
            };
            
            next();
        } catch (err) {
            console.error('Redis Cache Error:', err);
            next(); // Proceed without cache if Redis fails
        }
    };
};

// Utility to clear cache keys by pattern (used on POST/PUT/DELETE)
const invalidateCache = async (pattern) => {
    try {
        if (!redisClient.isReady) return;
        
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    } catch (err) {
        console.error('Redis Invalidate Cache Error:', err);
    }
};

module.exports = {
    checkCache,
    invalidateCache
};
