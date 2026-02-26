const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        countInStock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('ProductVariant', productVariantSchema);
