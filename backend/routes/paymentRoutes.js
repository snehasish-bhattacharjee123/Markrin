const express = require('express');
const router = express.Router();
const {
    createPaymentIntent,
    getStripeKey,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-payment-intent', protect, createPaymentIntent);
router.get('/config', getStripeKey);

module.exports = router;
