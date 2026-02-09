require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/User');
const Product = require('./models/Product');

// Sample Products Data
// Sample Products Data
const products = [
    {
        name: 'Classic White T-Shirt',
        description: 'A timeless classic white t-shirt made from 100% organic cotton. Perfect for everyday wear.',
        price: 29.99,
        category: 'Topwear',
        gender: 'Unisex',
        colors: ['Black'],
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
        category: 'Topwear',
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
        category: 'Topwear',
        gender: 'Men',
        colors: ['Black'],
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
        category: 'Topwear',
        gender: 'Unisex',
        colors: ['Black'],
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
        category: 'Topwear',
        gender: 'Unisex',
        colors: ['Black'],
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
        category: 'Topwear',
        gender: 'Women',
        colors: ['Black'],
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
        const admin = await User.create(adminUser);
        const customer = await User.create(customerUser);

        console.log('Users created:');
        console.log(`  Admin: ${admin.email} (password: admin123)`);
        console.log(`  Customer: ${customer.email} (password: password123)`);

        // Create products
        const sampleProducts = products.map((product, index) => {
            return {
                ...product,
                user: admin._id,
                sku: `SKU-${index + 1}`,
                collections: 'Latest Collection',
                dimensions: { length: 10, width: 10, height: 10 },
                weight: 0.5,
                metaTitle: product.name,
                metaDescription: product.description,
                metaKeywords: `${product.category}, ${product.brand}, ${product.gender}`,
            };
        });

        await Product.insertMany(sampleProducts);
        console.log(`\n${sampleProducts.length} products created successfully!`);

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
