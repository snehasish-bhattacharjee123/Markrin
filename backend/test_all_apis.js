const API_BASE = 'http://localhost:9000/api';

async function logResponse(name, res) {
    let text = await res.text();
    let isJson = false;
    try {
        text = JSON.parse(text);
        isJson = true;
    } catch { }

    const statusObj = {
        name,
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
    };

    if (res.ok) {
        console.log(`✅ [PASS] ${name} (${res.status})`);
        // if (isJson) console.log(JSON.stringify(text).substring(0, 100) + '...');
    } else {
        console.log(`❌ [FAIL] ${name} (${res.status})`);
        console.log(`   `, isJson ? text : text.substring(0, 100));
    }
    return { res, data: isJson ? text : null, headers: res.headers };
}

let sessionCookie = '';

function getOptions(method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(sessionCookie ? { 'Cookie': sessionCookie } : {})
        }
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    return options;
}

function updateCookie(headers) {
    const rawCookies = headers.get('set-cookie');
    if (rawCookies) {
        sessionCookie = rawCookies.split(',').map(c => c.split(';')[0]).join('; ');
    }
}

async function runTests() {
    console.log('--- Starting Comprehensive API Tests ---\n');

    // 1. Auth Registration
    const testEmail = `test_${Date.now()}@example.com`;
    const regReq = await fetch(`${API_BASE}/auth/register`, getOptions('POST', {
        name: 'Test Setup User',
        email: testEmail,
        password: 'password123',
        phone: '1234567890'
    }));
    await logResponse('Auth: Register User', regReq);

    // 2. Auth Login
    const loginReq = await fetch(`${API_BASE}/auth/login`, getOptions('POST', {
        email: testEmail,
        password: 'password123'
    }));
    const { data: loginData, headers } = await logResponse('Auth: Login User', loginReq);
    updateCookie(headers);

    // 3. Products: List
    const prodReq = await fetch(`${API_BASE}/products?limit=1`, getOptions('GET'));
    const { data: prodData } = await logResponse('Products: Get All (Limit 1)', prodReq);

    let sampleProductId = 'fake12345678901234567890'; // fallback
    if (prodData && prodData.data && prodData.data.products && prodData.data.products.length > 0) {
        sampleProductId = prodData.data.products[0]._id;
    } else if (prodData && prodData.products && prodData.products.length > 0) {
        sampleProductId = prodData.products[0]._id;
    }

    // 4. Products: Details
    const prodDetReq = await fetch(`${API_BASE}/products/${sampleProductId}`, getOptions('GET'));
    await logResponse('Products: Get By ID', prodDetReq);

    // 5. Categories: List
    const catReq = await fetch(`${API_BASE}/categories`, getOptions('GET'));
    const { data: catData } = await logResponse('Categories: Get All', catReq);

    let sampleCategorySlug = 'mens';
    if (catData && catData.data && catData.data.length > 0) {
        sampleCategorySlug = catData.data[0].slug;
    } else if (catData && Array.isArray(catData) && catData.length > 0) {
        sampleCategorySlug = catData[0].slug;
    }

    // 6. Variants: Get by product ID
    const varReq = await fetch(`${API_BASE}/products/${sampleProductId}/variants`, getOptions('GET'));
    await logResponse('Variants: Get For Product', varReq);

    // 7. Reviews: Get by product ID
    const revReq = await fetch(`${API_BASE}/products/${sampleProductId}/reviews`, getOptions('GET'));
    await logResponse('Reviews: Get For Product', revReq);

    // 8. Reviews: Create a Review (Requires Auth via Cookie)
    const revCreateReq = await fetch(`${API_BASE}/products/${sampleProductId}/reviews`, getOptions('POST', {
        rating: 4,
        comment: "This is a great automated test comment!"
    }));
    await logResponse('Reviews: Create Review (Auth)', revCreateReq);

    // 9. SizeCharts: Get by category
    const scReq = await fetch(`${API_BASE}/sizecharts/category/${sampleCategorySlug}`, getOptions('GET'));
    await logResponse('SizeCharts: Get By Category', scReq);

    // 10. Cart: Get User Cart (Auth)
    const cartReq = await fetch(`${API_BASE}/cart`, getOptions('GET'));
    await logResponse('Cart: Get User Cart (Auth)', cartReq);

    // 11. Wishlist: Get User Wishlist (Auth)
    const wlReq = await fetch(`${API_BASE}/wishlist`, getOptions('GET'));
    await logResponse('Wishlist: Get User Wishlist (Auth)', wlReq);

    // 12. Auth: Profile
    const profReq = await fetch(`${API_BASE}/auth/profile`, getOptions('GET'));
    await logResponse('Auth: Get Profile (Auth)', profReq);

    // 13. Auth Logout
    const logoutReq = await fetch(`${API_BASE}/auth/logout`, getOptions('POST'));
    await logResponse('Auth: Logout', logoutReq);

    console.log('\n--- API Tests Finished ---');
}

runTests();
