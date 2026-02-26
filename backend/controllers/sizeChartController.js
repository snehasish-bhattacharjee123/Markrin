const SizeChart = require('../models/SizeChart');

// @desc    Get size chart by category
// @route   GET /api/sizecharts/category/:category
// @access  Public
const getSizeChart = async (req, res) => {
    try {
        const searchCategory = req.params.category.toLowerCase().trim();
        const searchTerms = searchCategory.split(/[\s-]+/);

        // Try exact match first
        let sizeChart = await SizeChart.findOne({ category: searchCategory });

        // If no exact match, try broad regex
        if (!sizeChart) {
            const regexPattern = searchTerms.join('|');
            sizeChart = await SizeChart.findOne({
                category: { $regex: new RegExp(regexPattern, 'i') }
            });
        }

        if (!sizeChart) {
            return res.status(200).json({ success: true, data: null, message: 'Size chart not found for this category' });
        }
        res.status(200).json({ success: true, data: sizeChart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all size charts
// @route   GET /api/sizecharts
// @access  Private/Admin
const getAllSizeCharts = async (req, res) => {
    try {
        const sizeCharts = await SizeChart.find({});
        res.status(200).json({ success: true, count: sizeCharts.length, data: sizeCharts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a size chart
// @route   POST /api/sizecharts
// @access  Private/Admin
const createSizeChart = async (req, res) => {
    try {
        const { category, image_url_cm, image_url_inch, measurement_data } = req.body;

        const exists = await SizeChart.findOne({ category: category.toLowerCase() });
        if (exists) {
            return res.status(400).json({ success: false, message: 'Size chart already exists for this category' });
        }

        const sizeChart = await SizeChart.create({
            category: category.toLowerCase(),
            image_url_cm,
            image_url_inch,
            measurement_data
        });

        res.status(201).json({ success: true, data: sizeChart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a size chart
// @route   PUT /api/sizecharts/:id
// @access  Private/Admin
const updateSizeChart = async (req, res) => {
    try {
        const sizeChart = await SizeChart.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!sizeChart) {
            return res.status(404).json({ success: false, message: 'Size chart not found' });
        }

        res.status(200).json({ success: true, data: sizeChart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a size chart
// @route   DELETE /api/sizecharts/:id
// @access  Private/Admin
const deleteSizeChart = async (req, res) => {
    try {
        const sizeChart = await SizeChart.findById(req.params.id);
        if (!sizeChart) {
            return res.status(404).json({ success: false, message: 'Size chart not found' });
        }

        await sizeChart.deleteOne();
        res.status(200).json({ success: true, message: 'Size chart removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getSizeChart,
    getAllSizeCharts,
    createSizeChart,
    updateSizeChart,
    deleteSizeChart
};
