const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate({
            path: 'items.variant_id',
            populate: {
                path: 'product_id',
                select: 'name basePrice discountPrice images slug category'
            }
        });

        if (!cart) {
            // Create empty cart if doesn't exist
            cart = await Cart.create({ user: req.user._id, items: [] });
            cart = await Cart.findById(cart._id).populate({
                path: 'items.variant_id',
                populate: {
                    path: 'product_id',
                    select: 'name basePrice discountPrice images slug category'
                }
            });
        }

        // Remove stale items whose variant or product reference no longer exists
        const originalLength = cart.items.length;
        cart.items = cart.items.filter((item) => item.variant_id && item.variant_id.product_id);
        if (cart.items.length !== originalLength) {
            await cart.save();
            cart = await Cart.findById(cart._id).populate({
                path: 'items.variant_id',
                populate: {
                    path: 'product_id',
                    select: 'name basePrice discountPrice images slug category'
                }
            });
        }

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    try {
        let { variant_id, quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(variant_id)) {
            return res.status(400).json({ message: 'Invalid variant id' });
        }

        const ProductVariant = require('../models/ProductVariant');
        const Product = require('../models/Product');

        let variant = await ProductVariant.findById(variant_id).populate('product_id', 'basePrice discountPrice name slug');

        if (!variant) {
            // Check if it's actually a Product ID (frontend placeholder behavior)
            const product = await Product.findById(variant_id);
            if (!product) {
                return res.status(404).json({ message: 'Product variant not found' });
            }

            // Find first variant for this product, or create a default one if none exist
            variant = await ProductVariant.findOne({ product_id: product._id }).populate('product_id', 'basePrice discountPrice name slug');
            if (!variant) {
                variant = await ProductVariant.create({
                    product_id: product._id,
                    size: 'Default',
                    color: 'Default',
                    countInStock: 100, // mock stock
                    sku: `SKU-${product._id.toString().substring(0, 8)}`,
                });
                // hydrate populate for downstream logic
                variant.product_id = product;
            }

            // Re-map variant_id to the actual variant's ID
            variant_id = variant._id.toString();
        }

        // Check stock
        if (variant.countInStock < quantity) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            // Create new cart
            cart = new Cart({
                user: req.user._id,
                items: [],
            });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            (item) => item.variant_id.toString() === variant_id
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            const actualPrice = (variant.product_id.discountPrice && variant.product_id.discountPrice < variant.product_id.basePrice)
                ? variant.product_id.discountPrice
                : variant.product_id.basePrice;

            // Add new item
            cart.items.push({
                variant_id,
                quantity,
                price: actualPrice,
            });
        }

        await cart.save();

        // Populate and return
        cart = await Cart.findById(cart._id).populate({
            path: 'items.variant_id',
            populate: {
                path: 'product_id',
                select: 'name basePrice discountPrice images slug category'
            }
        });

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item._id.toString() === itemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        const item = cart.items[itemIndex];

        if (quantity !== undefined) {
            if (quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                item.quantity = quantity;
            }
        }

        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate({
            path: 'items.variant_id',
            populate: {
                path: 'product_id',
                select: 'name basePrice discountPrice images slug category'
            }
        });

        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate({
            path: 'items.variant_id',
            populate: {
                path: 'product_id',
                select: 'name basePrice discountPrice images slug category'
            }
        });

        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
};
