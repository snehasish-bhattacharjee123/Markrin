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
        category: {
            type: String,
            required: true,
            enum: ['T-Shirts', 'Jeans', 'Jackets', 'Shoes', 'Accessories', 'Graphic Tees', 'Hoodies', 'Pants'],
        },
        gender: {
            type: String,
            required: true,
            enum: ['Men', 'Women', 'Unisex'],
        },
        colors: [
            {
                type: String,
                enum: ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Grey', 'Brown', 'Pink', 'Orange'],
            },
        ],
        sizes: [
            {
                type: String,
                enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            },
        ],
        material: {
            type: String,
            enum: ['Cotton', 'Polyester', 'Wool', 'Leather', 'Denim', 'Silk', 'Linen'],
        },
        brand: {
            type: String,
            trim: true,
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
        countInStock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
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
    },
    {
        timestamps: true,
    }
);

// Index for faster filtering
productSchema.index({ category: 1, gender: 1, brand: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
