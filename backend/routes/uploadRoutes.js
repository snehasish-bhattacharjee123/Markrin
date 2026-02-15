const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple } = require('../middleware/upload');
const { protect, admin } = require('../middleware/authMiddleware');
const { cloudinary } = require('../config/cloudinary');

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, (req, res) => {
    try {
        uploadSingle(req, res, (err) => {
            try {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }
                if (!req.file) {
                    return res.status(400).json({ message: 'No file uploaded' });
                }
                res.json({
                    url: req.file.path,
                    publicId: req.file.filename,
                    altText: req.file.originalname,
                });
            } catch (error) {
                console.error('Upload single callback error:', error);
                res.status(500).json({ message: 'Server error during upload', error: error.message });
            }
        });
    } catch (error) {
        console.error('Upload single error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private/Admin
router.post('/multiple', protect, admin, (req, res) => {
    try {
        uploadMultiple(req, res, (err) => {
            try {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }
                if (!req.files || req.files.length === 0) {
                    return res.status(400).json({ message: 'No files uploaded' });
                }
                const images = (req.files || []).map(file => ({
                    url: file.path,
                    publicId: file.filename,
                    altText: file.originalname,
                }));
                res.json(images);
            } catch (error) {
                console.error('Upload multiple callback error:', error);
                res.status(500).json({ message: 'Server error during upload', error: error.message });
            }
        });
    } catch (error) {
        console.error('Upload multiple error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/delete
// @access  Private/Admin
// Accepts publicId in request body since it may contain slashes
router.delete('/delete', protect, admin, async (req, res) => {
    try {
        const { publicId } = req.body;

        if (!publicId) {
            return res.status(400).json({ message: 'Public ID is required' });
        }

        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result === 'ok' || result.result === 'not found') {
            res.json({ message: 'Image deleted successfully' });
        } else {
            res.status(400).json({ message: 'Failed to delete image', result });
        }
    } catch (error) {
        console.error('Image delete error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;