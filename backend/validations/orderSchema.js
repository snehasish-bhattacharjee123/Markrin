const { z } = require('zod');

const orderSchema = z.object({
    body: z.object({
        shippingAddress: z.object({
            street: z.string().min(1, 'Street is required'),
            city: z.string().min(1, 'City is required'),
            state: z.string().min(1, 'State is required'),
            postalCode: z.string().min(1, 'Postal code is required'),
            country: z.string().optional().default('India'),
        }),
        paymentMethod: z.enum(['Razorpay', 'COD']).optional().default('COD'),
    }),
});

module.exports = {
    orderSchema,
};
