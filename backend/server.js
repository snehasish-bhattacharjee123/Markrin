

// 1. FORCE IPV4 (Critical for Node 24 + Redis/MongoDB Atlas)
const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS to bypass local resolver issues

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { connectRedis, getIsRedisAvailable } = require('./config/redis');
const morgan = require('morgan');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Connect to Databases with error catching to prevent crash
const startConnections = async () => {
    try {
        await connectDB();
        logger.info('MongoDB Connected...');
    } catch (err) {
        logger.error('MongoDB connection failed:', err.message);
    }

    try {
        await connectRedis();
        if (getIsRedisAvailable()) {
            logger.info('Redis Connected...');
        }
    } catch (err) {
        logger.error('Redis connection failed:', err.message);
        // Note: The app will still run, but Redis-dependent features might fail
    }

    // Initialize Workers only if Redis is successfully connected
    if (getIsRedisAvailable()) {
        try {
            require('./workers/emailWorker');
            logger.info('Email Worker started...');
        } catch (e) {
            logger.error('Worker initialization failed:', e.message);
        }
    } else {
        logger.warn('Redis not available, skipping worker initialization.');
    }
};

startConnections();

const app = express();

// Request Logging
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Too many requests from this IP, please try again after 15 minutes',
        status: 429
    },
});

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiter to all routes
app.use('/api', limiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/upload', uploadRoutes);
app.use('/api/sizecharts', require('./routes/sizeChartRoutes'));

// Health check route
app.get('/', (req, res) => {
    res.json({
        message: 'Markrin E-Commerce API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            cart: '/api/cart',
            orders: '/api/orders',
            admin: '/api/admin',
            wishlist: '/api/wishlist',
            categories: '/api/categories',
            sizecharts: '/api/sizecharts',
        },
    });
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Error Handler
app.use((err, req, res, next) => {
    logger.error(err.stack);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ message: messages.join(', ') });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({ message: `Duplicate value for ${field}` });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
    }

    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

// Graceful error handling
process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    // Only exit if the error is truly fatal to the process
    if (!error.message.includes('ECONNREFUSED')) {
        setTimeout(() => process.exit(1), 1000);
    }
});
