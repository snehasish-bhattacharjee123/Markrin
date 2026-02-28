const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = process.env.RAZORPAY_KEY_ID
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
    : null;

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createPaymentIntent = async (req, res) => {
    try {
        if (!razorpay) {
            return res.status(500).json({
                message: 'Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your env file.'
            });
        }

        const { orderId } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const options = {
            amount: Math.round(order.totalPrice * 100), // amount in the smallest currency unit (paise)
            currency: 'INR',
            receipt: `receipt_order_${order._id}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // We send back both the order id from razorpay and the razorpayOrder
        res.send({
            id: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: razorpayOrder.amount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Razorpay Key
// @route   GET /api/payment/config
// @access  Public
const getStripeKey = (req, res) => {
    try {
        res.send({ key: process.env.RAZORPAY_KEY_ID || '' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createPaymentIntent,
    getStripeKey,
};
