const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const validate = require('../middleware/validate');
const { orderSchema } = require('../validations/orderSchema');

// All order routes are protected
router.use(protect);

router.post('/', validate(orderSchema), createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/pay', updateOrderToPaid);

module.exports = router;
