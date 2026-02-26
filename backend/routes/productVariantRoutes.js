const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getVariantsByProduct,
    createVariant,
    updateVariant,
    deleteVariant
} = require('../controllers/productVariantController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getVariantsByProduct)
    .post(protect, admin, createVariant);

router.route('/:id')
    .put(protect, admin, updateVariant)
    .delete(protect, admin, deleteVariant);

module.exports = router;
