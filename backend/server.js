require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
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

// Connect to Databases
connectDB();
connectRedis();

// Initialize Workers
require('./workers/emailWorker');

const app = express();

// Request Logging
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2000, // Significantly increased for development/testing
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
app.use(compression()); // Compress all responses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiter to all routes
app.use('/api', limiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/upload', uploadRoutes);

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
        },
    });
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Error Handler – catches uncaught errors forwarded by next(err) or asyncHandler
app.use((err, req, res, next) => {
    logger.error(err.stack);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ message: messages.join(', ') });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({ message: `Duplicate value for ${field}` });
    }

    // JWT errors
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

// Graceful error handling for unhandled rejections & exceptions
process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    // Give the server time to finish processing before exiting
    setTimeout(() => process.exit(1), 1000);
});