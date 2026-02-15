const Stripe = require('stripe');
const Order = require('../models/Order');

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;

// @desc    Create Payment Intent
// @route   POST /api/payment/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
    try {
        if (!stripe) {
            return res.status(500).json({
                message: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your env file.'
            });
        }

        const { orderId } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.totalPrice * 100), // amount in cents
            currency: 'usd', // or 'inr' depending on your region
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                orderId: order._id.toString(),
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Stripe Publishable Key
// @route   GET /api/payment/config
// @access  Public
const getStripeKey = (req, res) => {
    try {
        res.send({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createPaymentIntent,
    getStripeKey,
};
