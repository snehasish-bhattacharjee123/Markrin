const express = require('express');
const router = express.Router();
const {
    getProducts,
    getNewArrivals,
    getFeaturedProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const validate = require('../middleware/validate');
const { cache } = require('../middleware/cache');
const { productSchema, productQuerySchema } = require('../validations/productSchema');

// Public routes
router.get('/new-arrivals', getNewArrivals);
router.get('/featured', getFeaturedProducts);
router.get('/:id/related', require('../controllers/productController').getRelatedProducts);
router.get('/', validate(productQuerySchema), getProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, admin, validate(productSchema), createProduct);
router.put('/:id', protect, admin, updateProduct); // We can add a partial schema for update later
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
