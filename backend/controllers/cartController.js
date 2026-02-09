const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate(
            'items.product',
            'name price images countInStock sizes colors'
        );

        if (!cart) {
            // Create empty cart if doesn't exist
            cart = await Cart.create({ user: req.user._id, items: [] });
            cart = await Cart.findById(cart._id).populate(
                'items.product',
                'name price images countInStock sizes colors'
            );
        }

        // Remove stale items whose product reference no longer exists
        const originalLength = cart.items.length;
        cart.items = cart.items.filter((item) => item.product);
        if (cart.items.length !== originalLength) {
            await cart.save();
            cart = await Cart.findById(cart._id).populate(
                'items.product',
                'name price images countInStock sizes colors'
            );
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
        const { productId, quantity, size, color } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product id' });
        }

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check stock
        if (product.countInStock < quantity) {
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
            (item) =>
                item.product.toString() === productId &&
                item.size === size &&
                item.color === color
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                quantity,
                size,
                color,
                price: product.price,
            });
        }

        await cart.save();

        // Populate and return
        cart = await Cart.findById(cart._id).populate(
            'items.product',
            'name price images countInStock sizes colors'
        );

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
        const { quantity, size, color } = req.body;
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
        const productId = item.product.toString();

        // If updating size or color, check if another item with same specs already exists
        if (size !== undefined || color !== undefined) {
            const newSize = size !== undefined ? size : item.size;
            const newColor = color !== undefined ? color : item.color;

            const existingSameItemIndex = cart.items.findIndex(
                (it, idx) =>
                    idx !== itemIndex &&
                    it.product.toString() === productId &&
                    it.size === newSize &&
                    it.color === newColor
            );

            if (existingSameItemIndex > -1) {
                // Merge quantities and remove the current item
                cart.items[existingSameItemIndex].quantity += (quantity !== undefined ? quantity : item.quantity);
                cart.items.splice(itemIndex, 1);
            } else {
                // Just update specs
                if (size !== undefined) item.size = size;
                if (color !== undefined) item.color = color;
                if (quantity !== undefined) item.quantity = quantity;
            }
        } else if (quantity !== undefined) {
            if (quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                item.quantity = quantity;
            }
        }

        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate(
            'items.product',
            'name price images countInStock sizes colors'
        );

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

        const updatedCart = await Cart.findById(cart._id).populate(
            'items.product',
            'name price images countInStock'
        );

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
