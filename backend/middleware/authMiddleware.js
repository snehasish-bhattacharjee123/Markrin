const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify token
const protect = async (req, res, next) => {
    try {
        let token;

        token = req.cookies.jwt;

        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token (exclude password)
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Not authorized, invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Not authorized, token expired' });
        }
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Admin middleware
const admin = (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }
    } catch (error) {
        console.error('Admin middleware error:', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { protect, admin };
