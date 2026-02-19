const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    console.warn('Could not set DNS servers:', e.message);
}

require('dotenv').config();
const mongoose = require('mongoose');

// Define minimal schemas to query with explicit collection names if needed, but assuming default is pluralized
const productSchema = new mongoose.Schema({
    name: String,
    sku: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    price: Number
}, { strict: false });
const Product = mongoose.model('Product', productSchema);

const categorySchema = new mongoose.Schema({
    name: String,
    _id: mongoose.Schema.Types.ObjectId
}, { strict: false });
const Category = mongoose.model('Category', categorySchema);

const checkData = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Look for the specific product mentioned by user
        const targetId = '6996e78e015328c96ea83ed6';
        let product = null;

        try {
            product = await Product.findById(targetId);
        } catch (e) {
            console.log('Invalid ID format for direct lookup');
        }

        if (!product) {
            console.log(`Product with ID ${targetId} not found directly.`);
            // Try searching by SKU 'asd'
            console.log('Searching by sku: "asd"');
            product = await Product.findOne({ sku: 'asd' });
        }

        if (product) {
            console.log('--- Product Found ---');
            console.log('ID:', product._id);
            console.log('Name:', product.name);
            console.log('SKU:', product.sku);
            console.log('Category ID in product:', product.category);

            if (product.category) {
                const category = await Category.findById(product.category);
                console.log('--- Category Lookup ---');
                if (category) {
                    console.log('Category Found:', category);
                } else {
                    console.log('Category NOT FOUND in database for ID:', product.category);
                }
            } else {
                console.log('Product has no category ID assigned.');
            }
        } else {
            console.log('Product not found by ID or SKU.');
        }

        console.log('--- All Categories ---');
        const categories = await Category.find({});
        console.log(categories.map(c => ({ id: c._id, name: c.name })));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkData();
