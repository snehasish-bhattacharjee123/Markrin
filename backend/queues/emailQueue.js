const { Queue } = require('bullmq');
const IORedis = require('ioredis');

let isQueueAvailable = false;

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    enableOfflineQueue: false,
    lazyConnect: true,
    retryStrategy: (times) => {
        if (times > 2) return null; // Stop retrying after 2 attempts
        return Math.min(times * 100, 2000);
    }
});

connection.on('error', (err) => {
    if (isQueueAvailable) {
        console.warn('⚠️ Email Queue connection lost. Background jobs disabled.');
    }
    isQueueAvailable = false;
});

connection.on('connect', () => {
    console.log('Email Queue (Redis) connected...');
    isQueueAvailable = true;
});

const emailQueue = new Queue('emailQueue', { connection });

// Try initial connection
connection.connect().catch(() => {
    // Error logged by event listener
});

const addEmailToQueue = async (data) => {
    try {
        if (!isQueueAvailable) {
            console.warn('⚠️ Redis not available. Skipping email queue job.');
            return;
        }
        await emailQueue.add('sendEmail', data, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
        });
    } catch (err) {
        console.warn('⚠️ Failed to add email to queue:', err.message);
    }
};

module.exports = { emailQueue, addEmailToQueue };
