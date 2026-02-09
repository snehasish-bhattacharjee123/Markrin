const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 0) return false; // Stop retrying if it fails once on startup
            return 1000;
        }
    }
});

let isRedisAvailable = false;

redisClient.on('error', (err) => {
    if (isRedisAvailable) {
        console.error('Redis Client Error', err.message);
        isRedisAvailable = false;
    }
});

redisClient.on('connect', () => {
    console.log('Redis connected...');
    isRedisAvailable = true;
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.warn('⚠️ Redis not available. Caching and background jobs will be disabled.');
        isRedisAvailable = false;
    }
};

module.exports = { redisClient, connectRedis, getIsRedisAvailable: () => isRedisAvailable };
