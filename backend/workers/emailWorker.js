const { Worker } = require('bullmq');
const IORedis = require('ioredis');

let isWorkerConnected = false;

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    enableOfflineQueue: false,
    lazyConnect: true,
    retryStrategy: (times) => {
        if (times > 2) return null;
        return Math.min(times * 100, 2000);
    }
});

connection.on('error', (err) => {
    isWorkerConnected = false;
});

connection.on('connect', () => {
    isWorkerConnected = true;
});

const worker = new Worker('emailQueue', async (job) => {
    if (job.name === 'sendEmail') {
        const { to, subject, body } = job.data;
        console.log(`[EmailWorker] Sending email to: ${to} | Subject: ${subject}`);

        // Simulating email sending delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log(`[EmailWorker] Email sent successfully to ${to}`);
    }
}, { connection });

worker.on('completed', (job) => {
    console.log(`[EmailWorker] Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
    console.error(`[EmailWorker] Job ${job.id} failed: ${err.message}`);
});

// Try initial connection
connection.connect().catch(() => { });

module.exports = worker;
