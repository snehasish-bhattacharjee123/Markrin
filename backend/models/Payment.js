const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        gateway: {
            type: String,
            required: true,
            default: 'Stripe',
        },
        transaction_id: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Succeeded', 'Failed', 'Refunded'],
            default: 'Pending',
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

paymentSchema.index({ order_id: 1 });
paymentSchema.index({ transaction_id: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
