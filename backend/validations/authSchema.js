const { z } = require('zod');

const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
    }),
});

const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').optional(),
        lastName: z.string().optional(),
        email: z.string().email('Invalid email address').optional(),
        password: z.string().min(6, 'Password must be at least 6 characters').optional(),
        phone: z.string().optional(),
        dob: z.string().optional().nullable(),
        gender: z.enum(['Male', 'Female', 'Other', '']).optional(),
        address: z.object({
            street: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            postalCode: z.string().optional(),
            country: z.string().optional(),
        }).optional(),
    }),
});

module.exports = {
    registerSchema,
    loginSchema,
    updateProfileSchema,
};
