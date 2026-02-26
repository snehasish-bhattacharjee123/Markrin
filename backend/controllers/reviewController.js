const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product_id: req.params.productId }).populate('user_id', 'name');
        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a review
// @route   POST /api/products/:productId/reviews
// @access  Private
const createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.productId;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const alreadyReviewed = await Review.findOne({
            product_id: productId,
            user_id: req.user._id,
        });

        if (alreadyReviewed) {
            return res.status(400).json({ success: false, message: 'Product already reviewed by this user' });
        }

        const review = await Review.create({
            product_id: productId,
            user_id: req.user._id,
            rating: Number(rating),
            comment,
        });

        // Update product average rating
        const reviews = await Review.find({ product_id: productId });
        const numReviews = reviews.length;
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

        product.numReviews = numReviews;
        product.rating = avgRating;
        await product.save({ validateBeforeSave: false });

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/products/:productId/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        if (review.user_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this review' });
        }

        const productId = review.product_id;
        await review.deleteOne();

        // Update product average rating
        const product = await Product.findById(productId);
        if (product) {
            const reviews = await Review.find({ product_id: productId });
            const numReviews = reviews.length;
            const avgRating = numReviews > 0 ? reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews : 0;

            product.numReviews = numReviews;
            product.rating = avgRating;
            await product.save({ validateBeforeSave: false });
        }

        res.status(200).json({ success: true, message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getProductReviews,
    createReview,
    deleteReview
};
