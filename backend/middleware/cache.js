const { redisClient, getIsRedisAvailable } = require('../config/redis');

const cache = (keyPrefix, ttl = 3600) => async (req, res, next) => {
    // Generate cache key based on prefix and URL (includes query params)
    const key = `${keyPrefix}:${req.originalUrl || req.url}`;

    try {
        if (!getIsRedisAvailable()) {
            return next();
        }

        const cachedData = await redisClient.get(key);
        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        // Store original res.json to intercept it
        const originalJson = res.json;
        res.json = function (data) {
            // Only cache successful status codes
            if (res.statusCode === 200) {
                redisClient.setEx(key, ttl, JSON.stringify(data)).catch(err =>
                    console.error('Redis set error:', err)
                );
            }
            return originalJson.call(this, data);
        };

        next();
    } catch (err) {
        console.error('Cache middleware error:', err);
        next();
    }
};

const clearCache = (pattern) => async () => {
    try {
        if (!getIsRedisAvailable()) return;

        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log(`Cleared cache for pattern: ${pattern}`);
        }
    } catch (err) {
        console.error('Clear cache error:', err);
    }
};

module.exports = { cache, clearCache };
