const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration for product images
// Optimized: upload as-is, transformations happen at CDN delivery time
const productStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'markrin/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { quality: 'auto:best', fetch_format: 'auto' },
        ],
        resource_type: 'image',
    },
});

// Storage configuration for thumbnails
const thumbnailStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'markrin/thumbnails',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 400, height: 400, crop: 'fill', quality: 'auto', fetch_format: 'auto' }],
        resource_type: 'image',
    },
});

module.exports = {
    cloudinary,
    productStorage,
    thumbnailStorage,
};