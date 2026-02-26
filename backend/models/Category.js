const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
        },
        image: {
            type: String, // URL to category image
        },
        sizeChart: {
            type: {
                type: String,
                enum: ['image', 'table'],
                default: 'image',
            },
            data: {
                type: mongoose.Schema.Types.Mixed, // URL for image or JSON for table
            },
        },
    },
    {
        timestamps: true,
    }
);

// Pre-validate hook to generate slug from name before validation
categorySchema.pre('validate', function (next) {
    if (this.isModified('name') || !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .split(' ')
            .join('-')
            .replace(/[^\w-]+/g, '');
    }
    next();
});

module.exports = mongoose.model('Category', categorySchema);
