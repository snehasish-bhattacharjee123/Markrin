const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    refreshAccessToken,
    logoutUser,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const validate = require('../middleware/validate');
const { registerSchema, loginSchema, updateProfileSchema } = require('../validations/authSchema');

// Public routes
router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/refresh', refreshAccessToken);

// Protected routes
router.post('/logout', protect, logoutUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, validate(updateProfileSchema), updateUserProfile);

module.exports = router;
