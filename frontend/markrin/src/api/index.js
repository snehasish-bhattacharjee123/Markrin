// API Configuration
const API_BASE_URL = 'http://localhost:9000/api';

const fetchWithTimeout = async (url, options = {}, timeoutMs = 15000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await customFetch(url, { ...options, signal: controller.signal });
        return response;
    } finally {
        clearTimeout(timeoutId);
    }
};

// Helper function to get auth headers (no needed for token anymore, just content-type)
const getAuthHeaders = () => {
    return {
        'Content-Type': 'application/json',
    };
};

// Global Fetch Wrapper to handle 401s
const customFetch = async (url, options = {}) => {
    const defaultOptions = {
        credentials: 'include', // Important for cookies
        ...options,
        headers: {
            ...options.headers,
        }
    };

    const response = await fetch(url, defaultOptions);

    if (response.status === 401) {
        // Session expired or unauthorized
        // We can dispatch a custom event or let the calling component handle it
        // For strict session handling, we might clean up local state here
        try {
            // If we have a logout function exposed globally or event:
            window.dispatchEvent(new Event('auth:unauthorized'));
        } catch (e) { }
    }

    return response;
};

// Auth API
export const authAPI = {
    register: async (userData) => {
        const response = await customFetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        return data;
    },

    login: async (credentials) => {
        const response = await customFetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        return data;
    },

    getProfile: async () => {
        const response = await customFetch(`${API_BASE_URL}/auth/profile`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to get profile');
        }
        return data;
    },

    updateProfile: async (userData) => {
        const response = await customFetch(`${API_BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update profile');
        }
        return data;
    },

    refreshToken: async (refreshToken) => {
        const response = await customFetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ refreshToken }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to refresh token');
        }
        return data;
    },
};

// Products API
export const productsAPI = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                // Handle nested objects or arrays properly
                if (typeof value === 'object') {
                    // For objects: extract string values (e.g., category._id or category.name)
                    if (value._id) {
                        params.append(key, value._id);
                    } else if (value.name) {
                        params.append(key, value.name);
                    } else {
                        // Fallback to string representation if no id or name
                        params.append(key, String(value));
                    }
                } else {
                    params.append(key, String(value));
                }
            }
        });
        
        const response = await fetchWithTimeout(`${API_BASE_URL}/products?${params}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch products');
        }
        return data;
    },

    getById: async (id) => {
        const response = await fetchWithTimeout(`${API_BASE_URL}/products/${id}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch product');
        }
        return data;
    },

    getNewArrivals: async () => {
        const response = await fetch(`${API_BASE_URL}/products/new-arrivals`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch new arrivals');
        }
        return data;
    },

    getFeatured: async () => {
        const response = await fetch(`${API_BASE_URL}/products/featured`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch featured products');
        }
        return data;
    },
};

// Cart API
export const cartAPI = {
    get: async () => {
        const response = await customFetch(`${API_BASE_URL}/cart`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch cart');
        }
        return data;
    },

    addItem: async (productId, quantity, size, color) => {
        const response = await customFetch(`${API_BASE_URL}/cart`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ productId, quantity, size, color }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to add item to cart');
        }
        return data;
    },

    updateItem: async (itemId, updates) => {
        const response = await customFetch(`${API_BASE_URL}/cart/${itemId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updates),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update cart item');
        }
        return data;
    },

    removeItem: async (itemId) => {
        const response = await customFetch(`${API_BASE_URL}/cart/${itemId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to remove cart item');
        }
        return data;
    },

    clear: async () => {
        const response = await customFetch(`${API_BASE_URL}/cart`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to clear cart');
        }
        return data;
    },
};

// Orders API
export const ordersAPI = {
    create: async (shippingAddress, paymentMethod = 'COD') => {
        const response = await customFetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ shippingAddress, paymentMethod }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create order');
        }
        return data;
    },

    pay: async (id, paymentResult) => {
        const response = await customFetch(`${API_BASE_URL}/orders/${id}/pay`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(paymentResult),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update payment status');
        }
        return data;
    },

    getMyOrders: async () => {
        const response = await customFetch(`${API_BASE_URL}/orders/my-orders`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch orders');
        }
        return data;
    },

    getById: async (id) => {
        const response = await customFetch(`${API_BASE_URL}/orders/${id}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch order');
        }
        return data;
    },
};

// Wishlist API
export const wishlistAPI = {
    get: async (page = 1, limit = 8) => {
        const response = await customFetch(`${API_BASE_URL}/wishlist?page=${page}&limit=${limit}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch wishlist');
        }
        return data;
    },

    add: async (productId) => {
        const response = await customFetch(`${API_BASE_URL}/wishlist/${productId}`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to add to wishlist');
        }
        return data;
    },

    remove: async (productId) => {
        const response = await customFetch(`${API_BASE_URL}/wishlist/${productId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to remove from wishlist');
        }
        return data;
    },

    check: async (productId) => {
        const response = await customFetch(`${API_BASE_URL}/wishlist/check/${productId}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to check wishlist');
        }
        return data;
    },

    clear: async () => {
        const response = await customFetch(`${API_BASE_URL}/wishlist`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to clear wishlist');
        }
        return data;
    },
};

// Upload API (Cloudinary)
export const uploadAPI = {
    uploadSingle: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const userInfo = localStorage.getItem('userInfo');
        const headers = {};
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await customFetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            headers,
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to upload image');
        }
        return data;
    },

    uploadMultiple: async (files) => {
        const formData = new FormData();
        for (const file of files) {
            formData.append('images', file);
        }

        const userInfo = localStorage.getItem('userInfo');
        const headers = {};
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await customFetch(`${API_BASE_URL}/upload/multiple`, {
            method: 'POST',
            headers,
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to upload images');
        }
        return data;
    },

    deleteImage: async (publicId) => {
        const response = await customFetch(`${API_BASE_URL}/upload/delete`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            body: JSON.stringify({ publicId }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete image');
        }
        return data;
    },
};

// Admin API
export const adminAPI = {
    getStats: async () => {
        const response = await customFetch(`${API_BASE_URL}/admin/stats`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch stats');
        }
        return data;
    },

    getUsers: async (page = 1, limit = 10) => {
        const response = await customFetch(`${API_BASE_URL}/admin/users?page=${page}&limit=${limit}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch users');
        }
        return data;
    },

    createUser: async (userData) => {
        const response = await customFetch(`${API_BASE_URL}/admin/users`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create user');
        }
        return data;
    },

    updateUser: async (id, userData) => {
        const response = await customFetch(`${API_BASE_URL}/admin/users/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update user');
        }
        return data;
    },

    deleteUser: async (id) => {
        const response = await customFetch(`${API_BASE_URL}/admin/users/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete user');
        }
        return data;
    },

    getAllOrders: async (page = 1, limit = 10) => {
        const response = await customFetch(`${API_BASE_URL}/admin/orders?page=${page}&limit=${limit}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch orders');
        }
        return data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await customFetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update order status');
        }
        return data;
    },

    // Product Management
    createProduct: async (productData) => {
        const response = await customFetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create product');
        }
        return data;
    },

    updateProduct: async (id, productData) => {
        const response = await customFetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update product');
        }
        return data;
    },

    deleteProduct: async (id) => {
        const response = await customFetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete product');
        }
        return data;
    },
};

// Payment API
export const paymentAPI = {
    createPaymentIntent: async (orderId) => {
        const response = await customFetch(`${API_BASE_URL}/payment/create-payment-intent`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ orderId }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create payment intent');
        }
        return data;
    },

    getConfig: async () => {
        const response = await fetch(`${API_BASE_URL}/payment/config`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to get payment config');
        }
        return data;
    },
};

export default {
    auth: authAPI,
    products: productsAPI,
    cart: cartAPI,
    orders: ordersAPI,
    wishlist: wishlistAPI,
    upload: uploadAPI,
    admin: adminAPI,
    payment: paymentAPI,
};
