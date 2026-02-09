const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const migrateSlugs = async () => {
    try {
        const products = await Product.find({ slug: { $exists: false } });
        console.log(`Found ${products.length} products without slugs.`);

        for (const product of products) {
            // Trigger the pre-save hook by calling save()
            // The hook logic: 
            // if (this.isModified('name') || !this.slug) {
            //    this.slug = this.name.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, '');
            // }
            await product.save();
            console.log(`Generated slug for: ${product.name} -> ${product.slug}`);
        }

        console.log('Migration completed successfully.');
        process.exit();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateSlugs();
