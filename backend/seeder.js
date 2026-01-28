require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/User');
const Product = require('./models/Product');

// Sample Products Data
const products = [
    {
        name: 'Classic White T-Shirt',
        description: 'A timeless classic white t-shirt made from 100% organic cotton. Perfect for everyday wear.',
        price: 29.99,
        category: 'T-Shirts',
        gender: 'Unisex',
        colors: ['White'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Brand A',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
                altText: 'White T-shirt',
            },
        ],
        countInStock: 100,
        isFeatured: true,
        isNewArrival: true,
        rating: 4.5,
        numReviews: 25,
    },
    {
        name: 'Black Graphic Tee',
        description: 'Bold graphic design on premium black cotton. Stand out from the crowd.',
        price: 34.99,
        category: 'T-Shirts',
        gender: 'Men',
        colors: ['Black'],
        sizes: ['S', 'M', 'L', 'XL'],
        material: 'Cotton',
        brand: 'Brand B',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500',
                altText: 'Black graphic t-shirt',
            },
        ],
        countInStock: 75,
        isFeatured: false,
        isNewArrival: true,
        rating: 4.2,
        numReviews: 18,
    },
    {
        name: 'Casual Blue T-Shirt',
        description: 'Relaxed fit blue t-shirt for casual outings. Comfortable and stylish.',
        price: 19.99,
        category: 'T-Shirts',
        gender: 'Men',
        colors: ['Blue'],
        sizes: ['M', 'L', 'XL'],
        material: 'Cotton',
        brand: 'Brand C',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500',
                altText: 'Blue casual t-shirt',
            },
        ],
        countInStock: 50,
        isFeatured: true,
        isNewArrival: true,
        rating: 4.0,
        numReviews: 12,
    },
    {
        name: 'Oversized Streetwear Tee',
        description: 'Trendy oversized fit for the modern streetwear enthusiast.',
        price: 49.99,
        category: 'T-Shirts',
        gender: 'Unisex',
        colors: ['Black', 'White', 'Grey'],
        sizes: ['M', 'L', 'XL', 'XXL'],
        material: 'Cotton',
        brand: 'Brand D',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=500',
                altText: 'Oversized streetwear t-shirt',
            },
        ],
        countInStock: 40,
        isFeatured: true,
        isNewArrival: true,
        rating: 4.7,
        numReviews: 32,
    },
    {
        name: 'Minimal Grey T-Shirt',
        description: 'Simple and elegant grey t-shirt. A wardrobe essential.',
        price: 24.99,
        category: 'T-Shirts',
        gender: 'Unisex',
        colors: ['Grey'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        material: 'Cotton',
        brand: 'Brand A',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1585386959984-a41552231693?w=500',
                altText: 'Grey minimal t-shirt',
            },
        ],
        countInStock: 60,
        isFeatured: false,
        isNewArrival: true,
        rating: 4.3,
        numReviews: 15,
    },
    {
        name: 'Printed Fashion Tee',
        description: 'Premium fashion t-shirt with unique artistic print.',
        price: 59.99,
        category: 'T-Shirts',
        gender: 'Women',
        colors: ['White', 'Pink'],
        sizes: ['XS', 'S', 'M', 'L'],
        material: 'Cotton',
        brand: 'Brand B',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500',
                altText: 'Printed fashion t-shirt',
            },
        ],
        countInStock: 35,
        isFeatured: true,
        isNewArrival: true,
        rating: 4.8,
        numReviews: 28,
    },
    {
        name: 'Classic Blue Jeans',
        description: 'Timeless blue denim jeans with perfect fit and comfort.',
        price: 79.99,
        category: 'Jeans',
        gender: 'Men',
        colors: ['Blue'],
        sizes: ['S', 'M', 'L', 'XL'],
        material: 'Denim',
        brand: 'Brand C',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
                altText: 'Blue jeans',
            },
        ],
        countInStock: 45,
        isFeatured: true,
        isNewArrival: false,
        rating: 4.4,
        numReviews: 42,
    },
    {
        name: 'Leather Biker Jacket',
        description: 'Premium genuine leather jacket for the bold and adventurous.',
        price: 299.99,
        category: 'Jackets',
        gender: 'Men',
        colors: ['Black', 'Brown'],
        sizes: ['M', 'L', 'XL'],
        material: 'Leather',
        brand: 'Brand D',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
                altText: 'Leather biker jacket',
            },
        ],
        countInStock: 20,
        isFeatured: true,
        isNewArrival: false,
        rating: 4.9,
        numReviews: 56,
    },
    {
        name: 'White Sneakers',
        description: 'Clean white sneakers that go with everything. Ultra comfortable.',
        price: 89.99,
        category: 'Shoes',
        gender: 'Unisex',
        colors: ['White'],
        sizes: ['S', 'M', 'L', 'XL'],
        material: 'Leather',
        brand: 'Brand A',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
                altText: 'White sneakers',
            },
        ],
        countInStock: 80,
        isFeatured: true,
        isNewArrival: true,
        rating: 4.6,
        numReviews: 67,
    },
    {
        name: 'Gold Watch',
        description: 'Elegant gold-plated watch for the sophisticated individual.',
        price: 149.99,
        category: 'Accessories',
        gender: 'Unisex',
        colors: ['Yellow'],
        sizes: ['M'],
        material: 'Cotton',
        brand: 'Brand B',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500',
                altText: 'Gold watch',
            },
        ],
        countInStock: 25,
        isFeatured: true,
        isNewArrival: false,
        rating: 4.7,
        numReviews: 38,
    },
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
        await User.deleteMany();
        await Product.deleteMany();

        // Create users
        const createdAdmin = await User.create(adminUser);
        const createdCustomer = await User.create(customerUser);

        console.log('Users created:');
        console.log(`  Admin: ${createdAdmin.email} (password: admin123)`);
        console.log(`  Customer: ${createdCustomer.email} (password: password123)`);

        // Create products
        await Product.insertMany(products);
        console.log(`\n${products.length} products created successfully!`);

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
