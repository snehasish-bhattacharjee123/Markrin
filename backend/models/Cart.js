const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    variant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductVariant',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    price: {
        type: Number,
        required: true,
    },
});

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [cartItemSchema],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for total price
cartSchema.virtual('totalPrice').get(function () {
    return this.items.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
});

// Virtual for total items count
cartSchema.virtual('totalItems').get(function () {
    return this.items.reduce((total, item) => {
        return total + item.quantity;
    }, 0);
});

module.exports = mongoose.model('Cart', cartSchema);
