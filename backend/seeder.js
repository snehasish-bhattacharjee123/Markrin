require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');

// 6 Oversized T-Shirts
const oversizedProducts = [
    {
        name: 'Nocturnal Oversized Tee',
        description: 'Premium oversized t-shirt with reflective foil print. Made from heavy gauge French terry cotton for ultimate comfort.',
        price: 1199,
        category: 'oversized',
        gender: 'Unisex',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=500', altText: 'Nocturnal Oversized Tee' },
        ],
        countInStock: 10,
        isFeatured: true,
        isNewArrival: true,
        rating: 4.8,
        numReviews: 42,
    },
    {
        name: 'Shadow Box Oversized Tee',
        description: 'Dark aesthetic oversized fit with seamless stitch technology. Perfect for streetwear enthusiasts.',
        price: 1299,
        category: 'oversized',
        gender: 'Men',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7b1b0?w=500', altText: 'Shadow Box Oversized Tee' },
        ],
        countInStock: 10,
        isFeatured: false,
        isNewArrival: true,
        rating: 4.6,
        numReviews: 28,
    },
    {
        name: 'Midnight Drop Oversized Tee',
        description: 'Midnight-inspired oversized t-shirt with premium drop-shoulder design.',
        price: 1099,
        category: 'oversized',
        gender: 'Women',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500', altText: 'Midnight Drop Oversized Tee' },
        ],
        countInStock: 10,
        isFeatured: true,
        isNewArrival: true,
        rating: 4.7,
        numReviews: 35,
    },
    {
        name: 'Urban Legend Oversized Tee',
        description: 'Urban street style oversized t-shirt with bold graphics and relaxed fit.',
        price: 1399,
        category: 'oversized',
        gender: 'Unisex',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500', altText: 'Urban Legend Oversized Tee' },
        ],
        countInStock: 10,
        isFeatured: true,
        isNewArrival: false,
        rating: 4.9,
        numReviews: 56,
    },
    {
        name: 'Echo Chamber Oversized Tee',
        description: 'Minimalist oversized design with echo-inspired typography print.',
        price: 999,
        category: 'oversized',
        gender: 'Men',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1627225924765-552d49cf47ad?w=500', altText: 'Echo Chamber Oversized Tee' },
        ],
        countInStock: 10,
        isFeatured: false,
        isNewArrival: true,
        rating: 4.5,
        numReviews: 23,
    },
    {
        name: 'Velvet Void Oversized Tee',
        description: 'Luxurious oversized fit with velvet-touch fabric. Premium unisex streetwear.',
        price: 1499,
        category: 'oversized',
        gender: 'Women',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500', altText: 'Velvet Void Oversized Tee' },
        ],
        countInStock: 10,
        isFeatured: true,
        isNewArrival: true,
        rating: 4.8,
        numReviews: 41,
    },
];

// 6 Sweat Shirts
const sweatShirtProducts = [
    {
        name: 'Core Essential Sweat Shirt',
        description: 'Classic crew neck sweat shirt with ribbed cuffs and hem. Perfect for layering.',
        price: 1799,
        category: 'sweat-shirt',
        gender: 'Unisex',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', altText: 'Core Essential Sweat Shirt' },
        ],
        countInStock: 10,
        isFeatured: true,
        isNewArrival: true,
        rating: 4.7,
        numReviews: 38,
    },
    {
        name: 'Athletic Fleece Sweat Shirt',
        description: 'Performance fleece sweat shirt designed for active lifestyles. Warm and breathable.',
        price: 1999,
        category: 'sweat-shirt',
        gender: 'Men',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=500', altText: 'Athletic Fleece Sweat Shirt' },
        ],
        countInStock: 10,
        isFeatured: false,
        isNewArrival: true,
        rating: 4.6,
        numReviews: 29,
    },
    {
        name: 'Cozy Lounge Sweat Shirt',
        description: 'Ultra-soft lounge sweat shirt for relaxed days. Premium comfort fit.',
        price: 1699,
        category: 'sweat-shirt',
        gender: 'Women',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500', altText: 'Cozy Lounge Sweat Shirt' },
        ],
        countInStock: 10,
        isFeatured: true,
        isNewArrival: true,
        rating: 4.8,
        numReviews: 47,
    },
    {
        name: 'Street Ready Sweat Shirt',
        description: 'Urban street style sweat shirt with bold branding. Make a statement.',
        price: 1899,
        category: 'sweat-shirt',
        gender: 'Unisex',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1559582798-678dfc71ccd8?w=500', altText: 'Street Ready Sweat Shirt' },
        ],
        countInStock: 10,
        isFeatured: true,
        isNewArrival: false,
        rating: 4.5,
        numReviews: 31,
    },
    {
        name: 'Minimalist Crew Sweat Shirt',
        description: 'Clean, minimal design crew sweat shirt. Versatile wardrobe essential.',
        price: 1599,
        category: 'sweat-shirt',
        gender: 'Men',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1559582798-678dfc71ccd8?w=500', altText: 'Minimalist Crew Sweat Shirt' },
        ],
        countInStock: 10,
        isFeatured: false,
        isNewArrival: true,
        rating: 4.4,
        numReviews: 22,
    },
    {
        name: 'Oversized Comfort Sweat Shirt',
        description: 'Relaxed oversized fit sweat shirt for maximum comfort and style.',
        price: 2099,
        category: 'sweat-shirt',
        gender: 'Women',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500', altText: 'Oversized Comfort Sweat Shirt' },
        ],
        countInStock: 10,
        isFeatured: true,
        isNewArrival: true,
        rating: 4.9,
        numReviews: 52,
    },
];

// 6 Hoodies
const hoodieProducts = [
    {
        name: 'Essential Zip Hoodie',
        description: 'Classic zip-up hoodie with kangaroo pockets. Everyday essential.',
        price: 2499,
        category: 'hoodie',
        gender: 'Unisex',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500', altText: 'Essential Zip Hoodie' },
        ],
        countInStock: 10,
        isFeatured: true,
        isNewArrival: true,
        rating: 4.8,
        numReviews: 45,
    },
    {
        name: 'Pullover Classic Hoodie',
        description: 'Timeless pullover hoodie with drawstring hood. Cozy and warm.',
        price: 2299,
        category: 'hoodie',
        gender: 'Men',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=500', altText: 'Pullover Classic Hoodie' },
        ],
        countInStock: 10,
        isFeatured: false,
        isNewArrival: true,
        rating: 4.7,
        numReviews: 36,
    },
    {
        name: 'Cropped Style Hoodie',
        description: 'Trendy cropped hoodie for a modern look. Fashion-forward design.',
        price: 2199,
        category: 'hoodie',
        gender: 'Women',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500', altText: 'Cropped Style Hoodie' },
        ],
        countInStock: 10,
        isFeatured: true,
        isNewArrival: true,
        rating: 4.6,
        numReviews: 33,
    },
    {
        name: 'Tech Fleece Hoodie',
        description: 'Advanced tech fleece material hoodie. Lightweight yet warm.',
        price: 2799,
        category: 'hoodie',
        gender: 'Unisex',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Polyester',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1559582798-678dfc71ccd8?w=500', altText: 'Tech Fleece Hoodie' },
        ],
        countInStock: 10,
        isFeatured: true,
        isNewArrival: false,
        rating: 4.9,
        numReviews: 58,
    },
    {
        name: 'Graphic Print Hoodie',
        description: 'Statement hoodie with bold graphic print. Stand out from the crowd.',
        price: 2599,
        category: 'hoodie',
        gender: 'Men',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500', altText: 'Graphic Print Hoodie' },
        ],
        countInStock: 10,
        isFeatured: false,
        isNewArrival: true,
        rating: 4.5,
        numReviews: 27,
    },
    {
        name: 'Oversized Cozy Hoodie',
        description: 'Extra large oversized hoodie for ultimate comfort. Perfect for lounging.',
        price: 2899,
        category: 'hoodie',
        gender: 'Women',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', altText: 'Oversized Cozy Hoodie' },
        ],
        countInStock: 10,
        isFeatured: true,
        isNewArrival: true,
        rating: 4.8,
        numReviews: 49,
    },
];

// 1 Normal T-Shirt
const normalTShirtProducts = [
    {
        name: 'Classic Fit T-Shirt',
        description: 'The perfect everyday t-shirt. Regular fit, premium cotton, timeless design. The foundation of any wardrobe.',
        price: 799,
        category: 'normal-tshirt',
        gender: 'Unisex',
        colors: ['Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Markrin',
        images: [
            { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', altText: 'Classic Fit T-Shirt' },
        ],
        countInStock: 10,
        isFeatured: true,
        isNewArrival: true,
        rating: 4.7,
        numReviews: 124,
    },
];

// Combine all products
const products = [
    ...oversizedProducts,
    ...sweatShirtProducts,
    ...hoodieProducts,
    ...normalTShirtProducts,
];

// Admin user
const adminUser = {
    name: 'Admin User',
    email: 'admin@markrin.com',
    password: 'admin123',
    role: 'admin',
};

// Customer user
const customerUser = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'customer',
};

const importData = async () => {
    try {
        await connectDB();

        // Clear existing data
        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();

        // Create categories
        const categories = [
            { name: 'Oversized T-Shirts', slug: 'oversized', description: 'Comfortable oversized t-shirts' },
            { name: 'Sweatshirts', slug: 'sweat-shirt', description: 'Cozy sweatshirts for all seasons' },
            { name: 'Hoodies', slug: 'hoodie', description: 'Stylish and warm hoodies' },
            { name: 'Normal T-Shirts', slug: 'normal-tshirt', description: 'Classic fit t-shirts' },
            { name: 'Topwear', slug: 'Topwear', description: 'General topwear' },
            { name: 'Bottomwear', slug: 'Bottomwear', description: 'General bottomwear' },
        ];

        const createdCategories = await Category.insertMany(categories);

        // Map slug to ID
        const categoryMap = {};
        createdCategories.forEach(cat => {
            categoryMap[cat.slug] = cat._id;
        });

        console.log('Categories created:', Object.keys(categoryMap));

        // Create users
        const admin = await User.create(adminUser);
        const customer = await User.create(customerUser);

        console.log('Users created:');
        console.log(`  Admin: ${admin.email} (password: admin123)`);
        console.log(`  Customer: ${customer.email} (password: password123)`);

        // Create products
        const allProducts = [
            ...oversizedProducts,
            ...sweatShirtProducts,
            ...hoodieProducts,
            ...normalTShirtProducts,
        ];

        const sampleProducts = allProducts.map((product, index) => {
            return {
                ...product,
                user: admin._id,
                category: categoryMap[product.category], // Link to Category ID
                sku: `MRN-${product.category.toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
                collections: 'Latest Collection',
                dimensions: { length: 30, width: 25, height: 5 },
                weight: 0.5,
                metaTitle: product.name,
                metaDescription: product.description,
                metaKeywords: `${product.category}, ${product.brand}, ${product.gender}`,
                slug: product.name
                    .toLowerCase()
                    .split(' ')
                    .join('-')
                    .replace(/[^\w-]+/g, ''),
            };
        });

        await Product.insertMany(sampleProducts);
        console.log(`\n${sampleProducts.length} products created successfully!`);
        console.log('  - 6 Oversized T-Shirts');
        console.log('  - 6 Sweat Shirts');
        console.log('  - 6 Hoodies');
        console.log('  - 1 Normal T-Shirt');

        console.log('\nData imported successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();

        console.log('Data destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
