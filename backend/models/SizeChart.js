const mongoose = require('mongoose');

const sizeChartSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        image_url_cm: {
            type: String,
            default: '',
        },
        image_url_inch: {
            type: String,
            default: '',
        },
        measurement_data: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('SizeChart', sizeChartSchema);
