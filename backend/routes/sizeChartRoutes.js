const express = require('express');
const router = express.Router();
const {
    getSizeChart,
    getAllSizeCharts,
    createSizeChart,
    updateSizeChart,
    deleteSizeChart
} = require('../controllers/sizeChartController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getAllSizeCharts)
    .post(protect, admin, createSizeChart);

router.route('/category/:category')
    .get(getSizeChart);

router.route('/:id')
    .put(protect, admin, updateSizeChart)
    .delete(protect, admin, deleteSizeChart);

module.exports = router;
