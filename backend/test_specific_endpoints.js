const API_BASE_URL = 'http://localhost:9000/api';

async function testEndpoints() {
    console.log('--- Starting API Tests ---\n');

    const endpoints = [
        {
            name: '1. Shop Listing (Newest)',
            url: `${API_BASE_URL}/products?sort=newest&page=1&limit=12`
        },
        {
            name: '2. Product Details (Slug: admin)',
            url: `${API_BASE_URL}/products/admin`
        },
        {
            name: '3. Related/Category Products',
            url: `${API_BASE_URL}/products?category=6993716aef5283de2ab59c02&limit=5`
        }
    ];

    for (const endpoint of endpoints) {
        console.log(`Testing: ${endpoint.name}`);
        console.log(`URL: ${endpoint.url}`);
        try {
            const res = await fetch(endpoint.url, {
                headers: { 'Cache-Control': 'no-cache' } // Force fresh request
            });

            console.log(`Status: ${res.status} ${res.statusText}`);

            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    console.log(`Response: Array of ${data.length} items`);
                } else if (data.products && Array.isArray(data.products)) {
                    console.log(`Response: Object with ${data.products.length} products (Total: ${data.total})`);
                } else {
                    console.log(`Response: Object (Name: ${data.name || 'N/A'}, ID: ${data._id || 'N/A'})`);
                }
            } else {
                console.error('Error Body:', await res.text());
            }
        } catch (error) {
            console.error('Fetch Failed:', error.message);
        }
        console.log('--------------------------------------------------\n');
    }
}

testEndpoints();
