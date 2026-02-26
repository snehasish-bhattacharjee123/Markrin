const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a product name'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        basePrice: {
            type: Number,
            required: [true, 'Please add a base price'],
            min: 0,
        },
        discountPrice: {
            type: Number,
            min: 0,
            default: 0,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        brand: {
            type: String,
            trim: true,
        },
        collections: {
            type: String,
            required: true,
            trim: true,
            default: 'All', // Default value to ease migration/testing
        },
        material: {
            type: String,
        },
        gender: {
            type: String,
            required: true,
            enum: ['Unisex'],
            default: 'Unisex',
        },
        images: [
            {
                url: {
                    type: String,
                    required: true,
                },
                altText: {
                    type: String,
                    default: '',
                },
            },
        ],
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isNewArrival: {
            type: Boolean,
            default: false,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        tags: [String],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        metaTitle: String,
        metaDescription: String,
        metaKeywords: String,

        bestFit: {
            type: String,
        },
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
        },
        weight: Number,
        sku: {
            type: String,
            unique: true,
            sparse: true
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Pre-validate hook to generate slug from name
productSchema.pre('validate', function (next) {
    if (this.isModified('name') || !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .split(' ')
            .join('-')
            .replace(/[^\w-]+/g, '');
    }
    next();
});

// Index for faster filtering and search
productSchema.index({ name: 'text' }); // Text index for full-text search
productSchema.index({ name: 1 }); // Regular index for starts-with/regex search
productSchema.index({ category: 1, gender: 1, brand: 1, basePrice: 1 });

module.exports = mongoose.model('Product', productSchema);
