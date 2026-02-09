const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            // Store refresh token
            user.refreshTokens.push({ token: refreshToken });
            await user.save();

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: accessToken,
                refreshToken: refreshToken,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email and include password
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            // Add to session list (limit to 5 sessions)
            if (user.refreshTokens.length >= 5) {
                user.refreshTokens.shift();
            }
            user.refreshTokens.push({ token: refreshToken });
            await user.save();

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
                token: accessToken,
                refreshToken: refreshToken,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
                createdAt: user.createdAt,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }

            if (req.body.address) {
                user.address = req.body.address;
            }

            const updatedUser = await user.save();

            const accessToken = generateAccessToken(updatedUser._id);
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                address: updatedUser.address,
                token: accessToken,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token required' });
        }

        // Find user by refresh token
        const user = await User.findOne({ 'refreshTokens.token': refreshToken });
        if (!user) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // Verify token (checks expiry)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_keys_123', (err, decoded) => {
            if (err) {
                // Remove invalid token from list
                user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
                user.save();
                return res.status(403).json({ message: 'Invalid or expired refresh token' });
            }

            // Generate new access token
            const accessToken = generateAccessToken(user._id);
            res.json({ token: accessToken });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Logout user & clear tokens
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            // Remove the specific refresh token
            user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
            await user.save();
            res.json({ message: 'Logged out successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    refreshAccessToken,
    logoutUser,
};
