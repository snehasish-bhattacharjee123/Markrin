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
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            min: 0,
        },
        discountPrice: {
            type: Number,
            min: 0,
            default: 0,
        },
        countInStock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: ['oversized', 'sweat-shirt', 'hoodie', 'normal-tshirt'],
        },
        brand: {
            type: String,
            trim: true,
        },
        sizes: [
            {
                type: String,
                enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            },
        ],
        colors: [
            {
                type: String,
                enum: ['Black'], // 'Red', 'Blue', 'Green', 'White', 'Yellow', 'Grey', 'Brown', 'Pink', 'Orange'
            },
        ],
        collections: {
            type: String,
            required: true,
            trim: true,
            default: 'All', // Default value to ease migration/testing
        },
        material: {
            type: String,
            enum: ['Cotton', 'Polyester', 'Wool', 'Leather', 'Denim', 'Silk', 'Linen'],
        },
        gender: {
            type: String,
            required: true,
            enum: ['Men', 'Women', 'Unisex'],
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
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
        },
        weight: Number,
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

// Pre-save hook to generate slug from name
productSchema.pre('save', function (next) {
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
productSchema.index({ name: 'text', sku: 'text' }); // Text index for full-text search
productSchema.index({ name: 1 }); // Regular index for starts-with/regex search
productSchema.index({ sku: 1 }); // Unique index is already handled in schema
productSchema.index({ category: 1, gender: 1, brand: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
