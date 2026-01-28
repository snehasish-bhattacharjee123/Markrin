const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        // Get user's cart
        const cart = await Cart.findOne({ user: req.user._id }).populate(
            'items.product'
        );

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Build order items from cart
        const orderItems = cart.items.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            image: item.product.images[0]?.url || '',
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.price,
        }));

        // Calculate prices
        const itemsPrice = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        const shippingPrice = itemsPrice > 1000 ? 0 : 50; // Free shipping over ₹1000
        const taxPrice = Number((0.18 * itemsPrice).toFixed(2)); // 18% GST
        const totalPrice = Number(
            (itemsPrice + shippingPrice + taxPrice).toFixed(2)
        );

        // Create order
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod: paymentMethod || 'COD',
            shippingPrice,
            taxPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        // Clear the cart
        cart.items = [];
        await cart.save();

        // Update product stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { countInStock: -item.quantity },
            });
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('orderItems.product', 'name images');

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            'user',
            'name email'
        );

        if (order) {
            // Check if order belongs to user or user is admin
            if (
                order.user._id.toString() !== req.user._id.toString() &&
                req.user.role !== 'admin'
            ) {
                return res.status(403).json({ message: 'Not authorized' });
            }
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
};
