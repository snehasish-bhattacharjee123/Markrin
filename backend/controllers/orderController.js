const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ProductVariant = require('../models/ProductVariant');
const Payment = require('../models/Payment');
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        // Get user's cart
        const cart = await Cart.findOne({ user: req.user._id }).populate({
            path: 'items.variant_id',
            populate: {
                path: 'product_id',
                select: 'name images'
            }
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Build order items from cart
        const orderItems = cart.items.map((item) => {
            const variant = item.variant_id;
            const product = variant.product_id;

            return {
                variant_id: variant._id,
                name: product.name,
                image: product.images[0]?.url || '',
                quantity: item.quantity,
                priceAtTimeOfPurchase: item.price,
            };
        });

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
            shippingPrice,
            taxPrice,
            totalPrice,
            payment_status: 'Unpaid',
            order_status: 'Pending'
        });

        const createdOrder = await order.save();

        // Clear the cart
        cart.items = [];
        await cart.save();

        // Update product variant stock
        for (const item of orderItems) {
            await ProductVariant.findByIdAndUpdate(item.variant_id, {
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
            .populate({
                path: 'orderItems.variant_id',
                populate: {
                    path: 'product_id',
                    select: 'name images'
                }
            });

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
            order.payment_status = 'Paid';
            order.order_status = 'Processing';

            // Create payment record
            const payment = new Payment({
                order_id: order._id,
                user_id: req.user._id,
                gateway: 'Stripe',
                transaction_id: req.body.id,
                amount: order.totalPrice,
                status: 'Succeeded'
            });

            await payment.save();
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
