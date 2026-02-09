const { z } = require('zod');

const productSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required').trim(),
        description: z.string().min(1, 'Description is required'),
        price: z.number().min(0, 'Price must be positive'),
        discountPrice: z.number().min(0).optional().default(0),
        countInStock: z.number().min(0).default(0),
        sku: z.string().min(1, 'SKU is required').trim(),
        category: z.enum(['Topwear', 'Bottomwear']),
        brand: z.string().trim().optional(),
        sizes: z.array(z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL'])).optional().default([]),
        colors: z.array(z.string()).optional().default([]),
        collections: z.string().min(1, 'Collection is required').trim(),
        material: z.enum(['Cotton', 'Polyester', 'Wool', 'Leather', 'Denim', 'Silk', 'Linen']).optional(),
        gender: z.enum(['Men', 'Women', 'Unisex']),
        images: z.array(z.object({
            url: z.string().url('Invalid image URL'),
            altText: z.string().optional().default(''),
        })).min(1, 'At least one image is required'),
        isFeatured: z.boolean().optional().default(false),
        isNewArrival: z.boolean().optional().default(false),
        tags: z.array(z.string()).optional().default([]),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        metaKeywords: z.string().optional(),
        dimensions: z.object({
            length: z.number().optional(),
            width: z.number().optional(),
            height: z.number().optional(),
        }).optional(),
        weight: z.number().optional(),
    }),
});

const productQuerySchema = z.object({
    query: z.object({
        category: z.string().optional(),
        gender: z.string().optional(),
        color: z.string().optional(),
        size: z.string().optional(),
        material: z.string().optional(),
        brand: z.string().optional(),
        minPrice: z.string().optional(),
        maxPrice: z.string().optional(),
        sort: z.string().optional(),
        search: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
    }).optional(),
});

module.exports = {
    productSchema,
    productQuerySchema,
};
