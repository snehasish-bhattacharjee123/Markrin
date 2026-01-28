// API Configuration
const API_BASE_URL = 'http://localhost:9000/api';

const fetchWithTimeout = async (url, options = {}, timeoutMs = 15000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        return response;
    } finally {
        clearTimeout(timeoutId);
    }
};

// Helper function to get auth headers
const getAuthHeaders = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    }
    return {
        'Content-Type': 'application/json',
    };
};

// Auth API
export const authAPI = {
    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
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
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
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
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
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
};

// Products API
export const productsAPI = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
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
        const response = await fetch(`${API_BASE_URL}/cart`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch cart');
        }
        return data;
    },

    addItem: async (productId, quantity, size, color) => {
        const response = await fetch(`${API_BASE_URL}/cart`, {
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

    updateItem: async (itemId, quantity) => {
        const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ quantity }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update cart item');
        }
        return data;
    },

    removeItem: async (itemId) => {
        const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
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
        const response = await fetch(`${API_BASE_URL}/cart`, {
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
        const response = await fetch(`${API_BASE_URL}/orders`, {
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
        const response = await fetch(`${API_BASE_URL}/orders/${id}/pay`, {
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
        const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch orders');
        }
        return data;
    },

    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch order');
        }
        return data;
    },
};

// Admin API
export const adminAPI = {
    getStats: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/stats`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch stats');
        }
        return data;
    },

    getUsers: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch users');
        }
        return data;
    },

    createUser: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
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
        const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
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
        const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete user');
        }
        return data;
    },

    getAllOrders: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/orders`, {
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch orders');
        }
        return data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
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
        const response = await fetch(`${API_BASE_URL}/products`, {
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
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
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
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
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

export default {
    auth: authAPI,
    products: productsAPI,
    cart: cartAPI,
    orders: ordersAPI,
    admin: adminAPI,
};
