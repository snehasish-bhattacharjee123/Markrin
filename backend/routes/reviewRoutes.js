const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getProductReviews,
    createReview,
    deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProductReviews)
    .post(protect, createReview);

router.route('/:id')
    .delete(protect, deleteReview);

module.exports = router;
