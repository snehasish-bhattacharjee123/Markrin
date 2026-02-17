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
router.get('/new-arrivals', cache('products_new', 1800), getNewArrivals);
router.get('/featured', cache('products_featured', 1800), getFeaturedProducts);
router.get('/:id/related', cache('products_related', 3600), require('../controllers/productController').getRelatedProducts);
router.get('/', validate(productQuerySchema), cache('products_list', 3600), getProducts);
router.get('/:id', cache('product_detail', 3600), getProductById);

// Admin routes
router.post('/', protect, admin, validate(productSchema), createProduct);
router.put('/:id', protect, admin, updateProduct); // We can add a partial schema for update later
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
