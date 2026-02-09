const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Get user's wishlist with pagination
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        const { page = 1, limit = 8 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [] });
        }

        // Get total count before pagination
        const totalProducts = wishlist.products.length;

        // Populate with pagination
        const populatedWishlist = await Wishlist.findOne({ user: req.user._id })
            .populate({
                path: 'products',
                select: 'name price images countInStock category isFeatured isNewArrival',
                options: {
                    skip: (pageNum - 1) * limitNum,
                    limit: limitNum,
                },
            });

        res.json({
            products: populatedWishlist.products,
            page: pageNum,
            pages: Math.ceil(totalProducts / limitNum),
            total: totalProducts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product id' });
        }

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = new Wishlist({
                user: req.user._id,
                products: [],
            });
        }

        // Check if product already in wishlist
        if (wishlist.products.includes(productId)) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        wishlist.products.push(productId);
        await wishlist.save();

        const updatedWishlist = await Wishlist.findById(wishlist._id)
            .populate('products', 'name price images countInStock category');

        res.json({
            message: 'Added to wishlist',
            products: updatedWishlist.products,
            total: updatedWishlist.products.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        wishlist.products = wishlist.products.filter(
            (id) => id.toString() !== productId
        );

        await wishlist.save();

        const updatedWishlist = await Wishlist.findById(wishlist._id)
            .populate('products', 'name price images countInStock category');

        res.json({
            message: 'Removed from wishlist',
            products: updatedWishlist.products,
            total: updatedWishlist.products.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
const checkWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.json({ isInWishlist: false });
        }

        const isInWishlist = wishlist.products.includes(productId);
        res.json({ isInWishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (wishlist) {
            wishlist.products = [];
            await wishlist.save();
        }

        res.json({ message: 'Wishlist cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlist,
    clearWishlist,
};
