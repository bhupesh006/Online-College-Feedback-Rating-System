const { createClient } = require('redis');

// Initialize Redis Client
const REDIS_URL = process.env.REDIS_URL || (process.env.NODE_ENV === 'production' ? null : 'redis://127.0.0.1:6379');

let redisClient = {
    isReady: false,
    on: () => {},
    connect: async () => {},
    get: async () => null,
    setEx: async () => {},
    keys: async () => [],
    del: async () => {},
    sendCommand: () => {}
};

if (REDIS_URL) {
    redisClient = createClient({
        url: REDIS_URL
    });

    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    redisClient.on('connect', () => console.log('Redis Client Connected'));

    // Connect to Redis
    (async () => {
        try {
            await redisClient.connect();
        } catch (err) {
            console.error('Failed to connect to Redis', err);
        }
    })();
} else {
    console.log('Redis URL not provided, running without Redis cache.');
}

module.exports = redisClient;
