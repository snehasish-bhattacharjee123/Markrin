const multer = require('multer');
const { productStorage } = require('../config/cloudinary');

// Configure multer with Cloudinary storage
const upload = multer({
    storage: productStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false);
        }
    },
});

// Single image upload
const uploadSingle = upload.single('image');

// Multiple images upload (max 5)
const uploadMultiple = upload.array('images', 5);

module.exports = {
    uploadSingle,
    uploadMultiple,
};
