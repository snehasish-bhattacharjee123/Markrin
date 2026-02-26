const ProductVariant = require('../models/ProductVariant');
const Product = require('../models/Product');

// @desc    Get all variants for a product
// @route   GET /api/products/:productId/variants
// @access  Public
const getVariantsByProduct = async (req, res) => {
    try {
        const variants = await ProductVariant.find({ product_id: req.params.productId });
        res.status(200).json({ success: true, data: variants });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a product variant
// @route   POST /api/products/:productId/variants
// @access  Private/Admin
const createVariant = async (req, res) => {
    try {
        const { size, color, countInStock, sku } = req.body;
        const productId = req.params.productId;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const variantExists = await ProductVariant.findOne({ sku });
        if (variantExists) {
            return res.status(400).json({ success: false, message: 'Variant with this SKU already exists' });
        }

        const variant = await ProductVariant.create({
            product_id: productId,
            size,
            color,
            countInStock,
            sku
        });

        res.status(201).json({ success: true, data: variant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a variant
// @route   PUT /api/products/:productId/variants/:id
// @access  Private/Admin
const updateVariant = async (req, res) => {
    try {
        let variant = await ProductVariant.findById(req.params.id);
        if (!variant) {
            return res.status(404).json({ success: false, message: 'Variant not found' });
        }

        variant = await ProductVariant.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: variant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a variant
// @route   DELETE /api/products/:productId/variants/:id
// @access  Private/Admin
const deleteVariant = async (req, res) => {
    try {
        const variant = await ProductVariant.findById(req.params.id);
        if (!variant) {
            return res.status(404).json({ success: false, message: 'Variant not found' });
        }

        await variant.deleteOne();
        res.status(200).json({ success: true, message: 'Variant removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getVariantsByProduct,
    createVariant,
    updateVariant,
    deleteVariant
};
