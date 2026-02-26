require('dotenv').config();
const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

const API_BASE = 'http://localhost:9000/api';

// Helper to log requests
async function makeRequest(name, method, endpoint, body = null, cookie = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(cookie ? { 'Cookie': cookie } : {})
        }
    };
    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, options);
        let text = await res.text();
        let isJson = false;
        try {
            text = JSON.parse(text);
            isJson = true;
        } catch { }

        let newCookie = cookie;
        if (res.headers.get('set-cookie')) {
            newCookie = res.headers.get('set-cookie').split(',').map(c => c.split(';')[0]).join('; ');
        }

        if (res.ok) {
            console.log(`✅ [${method}] ${name}`);
        } else {
            console.log(`❌ [${method}] ${name} - Failed with status ${res.status}`);
            console.log(`   Detailed Error:`, isJson ? JSON.stringify(text) : text);
        }

        return { ok: res.ok, data: isJson ? text : null, cookie: newCookie };
    } catch (e) {
        console.log(`❌ [${method}] ${name} - Request Failed: ${e.message}`);
        return { ok: false, data: null, cookie };
    }
}

async function simulateFlow() {
    console.log('====================================================');
    console.log('🛍️  MARKRIN E-COMMERCE END-TO-END SIMULATION 🛍️');
    console.log('====================================================\n');

    const timestamp = Date.now();
    const adminEmail = `admin_${timestamp}@markrin.com`;
    const userEmail = `user_${timestamp}@example.com`;

    let adminCookie = null;
    let userCookie = null;

    // -----------------------------------------------------------------
    // 👑 PHASE 1: ADMIN OPERATIONS
    // -----------------------------------------------------------------
    console.log('--- 👑 Phase 1: Admin Operations ---\n');

    // 1. Register Admin
    console.log('> Registering Admin Account...');
    let res = await makeRequest('Register Admin', 'POST', '/auth/register', {
        name: 'Super Admin',
        email: adminEmail,
        password: 'adminPassword123!',
        phone: '9999999999'
    });

    // 2. Login Admin to get cookie
    res = await makeRequest('Login Admin', 'POST', '/auth/login', {
        email: adminEmail,
        password: 'adminPassword123!'
    });
    adminCookie = res.cookie;

    // Manually promote this user to admin directly in DB for testing purposes
    // (In a real scenario, this is done cautiously or via a seeder)
    const User = require('./models/User');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/markrin');
    await User.updateOne({ email: adminEmail }, { role: 'admin' });
    console.log('  (Promoted user to Admin directly in database for testing)');

    // 3. Admin creates a Category
    console.log('\n> Admin creating an "Oversized Tees" category...');
    res = await makeRequest('Create Category', 'POST', '/categories', {
        name: `Oversized Tees ${timestamp}`,
        description: 'Trendy oversized t-shirts for everyone.'
    }, adminCookie);

    // Fallback if category creation failed (e.g. unique constraint)
    const categorySlug = res.data?.slug || `oversized-tees-${timestamp}`;
    const categoryId = res.data?._id;

    // 4. Admin creates a Size Chart for the Category
    console.log(`\n> Admin creating a Size Chart for "${categorySlug}"...`);
    await makeRequest('Create Size Chart', 'POST', '/sizecharts', {
        category: categorySlug,
        measurements: ["S - Chest 38, Length 28", "M - Chest 40, Length 29", "L - Chest 42, Length 30"]
    }, adminCookie);

    // 5. Admin creates a Product
    console.log('\n> Admin creating a new Product...');
    res = await makeRequest('Create Product', 'POST', '/products', {
        name: `Graphic Oversized Tee ${timestamp}`,
        description: 'Heavyweight cotton graphic tee with drop shoulders.',
        price: 1200, // Zod validation expects 'price'
        basePrice: 1200,
        discountPrice: 999,
        category: 'oversized', // Must be one of ["Topwear"|"Bottomwear"|"oversized"|"sweat-shirt"|"hoodie"|"normal-tshirt"]
        collections: 'Summer Drop',
        gender: 'Unisex',
        images: [{ url: 'http://example.com/tee.jpg' }],
        brand: 'Markrin Originals',
        sku: `PRD-${timestamp}` // Zod expects SKU at the product level too
    }, adminCookie);
    const productId = res.data?._id;

    // 6. Admin adds Variants (Sizes/Colors)
    let variantId = null;
    if (productId) {
        console.log(`\n> Admin adding Variants to Product ${productId}...`);

        // Variant 1: Medium, Black
        res = await makeRequest('Create Variant (M, Black)', 'POST', `/products/${productId}/variants`, {
            size: 'M',
            color: 'Black',
            countInStock: 50,
            sku: `TEE-M-BLK-${timestamp}`
        }, adminCookie);
        variantId = res.data?.data?._id; // We'll buy this one later!

        // Variant 2: Large, White
        await makeRequest('Create Variant (L, White)', 'POST', `/products/${productId}/variants`, {
            size: 'L',
            color: 'White',
            countInStock: 25,
            sku: `TEE-L-WHT-${timestamp}`
        }, adminCookie);
    } else {
        console.log('❌ Skipping variants as product creation failed.');
    }


    // -----------------------------------------------------------------
    // 🛒 PHASE 2: CUSTOMER OPERATIONS
    // -----------------------------------------------------------------
    console.log('\n\n--- 🛒 Phase 2: Customer Operations ---\n');

    // 1. Customer registers
    console.log('> A new customer visits and registers...');
    await makeRequest('Register Customer', 'POST', '/auth/register', {
        name: 'Jane Smith',
        email: userEmail,
        password: 'securePassword456'
    });

    // 2. Customer logs in
    res = await makeRequest('Login Customer', 'POST', '/auth/login', {
        email: userEmail,
        password: 'securePassword456'
    });
    userCookie = res.cookie;

    if (productId && variantId) {
        // 3. Customer checks Size Chart before buying
        console.log(`\n> Customer wants to buy the Tee, but checks the Size Chart first...`);
        await makeRequest('Fetch Size Chart', 'GET', `/sizecharts/category/${categorySlug}`);

        // 4. Customer adds product to Wishlist
        console.log('\n> Customer decides to add the product to Wishlist while thinking...');
        await makeRequest('Add to Wishlist', 'POST', `/wishlist/${productId}`, null, userCookie);

        // 5. Customer decides to buy, adds variant to Cart
        console.log('\n> Customer adds the Medium Black Variant to Cart...');
        res = await makeRequest('Add to Cart', 'POST', '/cart', {
            variant_id: variantId,
            quantity: 2
        }, userCookie);

        const cartData = res.data?.data;
        if (cartData) {
            console.log(`  Cart total is now: ₹${cartData.totalPrice} for ${cartData.totalItems} items.`);
        }

        // 6. Customer places the Order
        console.log('\n> Customer proceeds to Checkout and creates an Order...');
        res = await makeRequest('Create Order', 'POST', '/orders', {
            shippingAddress: {
                street: "123 Main St",
                city: "Mumbai",
                state: "MH",
                postalCode: "400001",
                country: "India"
            }
        }, userCookie);

        const orderId = res.data?.data?._id;
        if (orderId) {
            console.log(`  Order successfully created! Order ID: ${orderId}`);

            // 7. Customer leaves a Review for the product
            console.log(`\n> Customer loved the experience and leaves a 5-star review!`);
            await makeRequest('Write Review', 'POST', `/products/${productId}/reviews`, {
                rating: 5,
                comment: "Amazing quality! Fits perfectly as per the size chart."
            }, userCookie);
        }
    } else {
        console.log('\n❌ Skipping customer cart/order flow because product/variant generation failed.');
    }

    // -----------------------------------------------------------------
    // 👑 PHASE 3: ADMIN FULFILLMENT
    // -----------------------------------------------------------------
    console.log('\n\n--- 👑 Phase 3: Admin Fulfillment ---\n');
    console.log('> Admin logs back in to check new orders...');

    // Fetch all orders
    res = await makeRequest('Admin Fetches All Orders', 'GET', '/admin/orders', null, adminCookie);
    const orders = res.data?.data?.orders || [];

    if (orders.length > 0) {
        const latestOrder = orders[0];
        console.log(`  Found ${orders.length} orders total in system.`);
        console.log(`  Processing Order ID ${latestOrder._id}...`);

        // Admin updates order status to Delivered
        console.log('\n> Admin marks the order as Delivered...');
        await makeRequest('Admin Updates Order Status', 'PUT', `/admin/orders/${latestOrder._id}/status`, {
            status: 'Delivered'
        }, adminCookie);
    } else {
        console.log('  No orders found to process.');
    }


    await mongoose.disconnect();
    console.log('\n====================================================');
    console.log('✅ SIMULATION COMPLETE.');
    console.log('====================================================\n');
}

simulateFlow();
