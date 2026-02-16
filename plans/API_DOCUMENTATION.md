# Markrin E-Commerce API Documentation

## Base URL
All API endpoints are relative to: `http://localhost:9000/api`

## Authentication
- Protected routes require authentication using cookies (session-based)
- Admin routes require additional admin privileges
- Headers: `Content-Type: application/json` with credentials included

## API Categories

### 1. Authentication APIs

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/refresh` | Refresh access token (issues new refresh token) | No |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/profile` | Get user profile | Yes |
| PUT | `/auth/profile` | Update user profile | Yes |

#### Register User
```javascript
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}

Response:
{
  "success": true,
  "data": {
    "_id": "65c000000000000000000000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```javascript
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "_id": "65c000000000000000000000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "address": {...},
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Refresh Token
```javascript
POST /api/auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // New refresh token
  }
}
```

#### Get User Profile
```javascript
GET /api/auth/profile

Response:
{
  "success": true,
  "data": {
    "_id": "65c000000000000000000000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "phone": "1234567890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "pincode": "10001"
    }
  }
}
```

#### Update User Profile
```javascript
PUT /api/auth/profile
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "pincode": "10001"
  }
}

Response:
{
  "success": true,
  "data": {
    "_id": "65c000000000000000000000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "phone": "1234567890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "pincode": "10001"
    }
  }
}
```

#### Logout User
```javascript
POST /api/auth/logout
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 2. Products APIs

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | `/products/` | Get all products (with filters) | No |
| GET | `/products/new-arrivals` | Get new arrival products | No |
| GET | `/products/featured` | Get featured products | No |
| GET | `/products/:id` | Get product by ID, slug, or name (case-insensitive) | No |
| POST | `/products/` | Create product | Yes (Admin) |
| PUT | `/products/:id` | Update product | Yes (Admin) |
| DELETE | `/products/:id` | Delete product | Yes (Admin) |

#### Get Products with Filters
```javascript
GET /api/products?category=shirts&priceRange=100-200&page=1&limit=10

Response:
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "65c000000000000000000001",
        "name": "Casual Shirt",
        "price": 150,
        "category": "shirts",
        "images": [...],
        "sizes": ["S", "M", "L"],
        "colors": ["blue", "red"]
      },
      {...}
    ],
    "page": 1,
    "pages": 5,
    "total": 45
  }
}
```

#### Get Product by ID or Name
```javascript
// By ObjectId
GET /api/products/65c000000000000000000001

// By Slug
GET /api/products/casual-shirt

// By Name (case-insensitive)
GET /api/products/casual%20shirt

Response:
{
  "success": true,
  "data": {
    "_id": "65c000000000000000000001",
    "name": "Casual Shirt",
    "description": "Comfortable cotton shirt",
    "price": 150,
    "discountPrice": 120,
    "countInStock": 50,
    "category": "shirts",
    "brand": "BrandX",
    "sizes": ["S", "M", "L"],
    "colors": ["blue", "red"],
    "images": [...],
    "isFeatured": false,
    "isNewArrival": true
  }
}
```

#### Create Product
```javascript
POST /api/products
{
  "name": "New Shirt",
  "description": "Latest collection shirt",
  "price": 200,
  "discountPrice": 160,
  "countInStock": 100,
  "category": "shirts",
  "brand": "BrandX",
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["blue", "red", "black"],
  "images": [...],
  "isFeatured": true,
  "isNewArrival": true
}

Response:
{
  "success": true,
  "data": {
    "_id": "65c000000000000000000002",
    "name": "New Shirt",
    ...
  }
}
```

### 3. Cart APIs

All routes are protected

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cart/` | Get user's cart |
| POST | `/cart/` | Add item to cart |
| PUT | `/cart/:itemId` | Update cart item |
| DELETE | `/cart/:itemId` | Remove item from cart |
| DELETE | `/cart/` | Clear entire cart |

#### Get Cart
```javascript
GET /api/cart

Response:
{
  "success": true,
  "data": {
    "_id": "65c000000000000000000010",
    "user": "65c000000000000000000000",
    "items": [
      {
        "_id": "65c000000000000000000011",
        "product": {...},
        "quantity": 2,
        "size": "M",
        "color": "blue",
        "price": 150
      }
    ]
  }
}
```

#### Add to Cart
```javascript
POST /api/cart
{
  "productId": "65c000000000000000000001",
  "quantity": 2,
  "size": "M",
  "color": "blue"
}

Response:
{
  "success": true,
  "data": {
    "_id": "65c000000000000000000010",
    "items": [
      {
        "_id": "65c000000000000000000011",
        "product": {...},
        "quantity": 2,
        "size": "M",
        "color": "blue",
        "price": 150
      }
    ]
  }
}
```

#### Update Cart Item
```javascript
PUT /api/cart/65c000000000000000000011
{
  "quantity": 3,
  "size": "L",
  "color": "red"
}

Response:
{
  "success": true,
  "data": {
    "_id": "65c000000000000000000010",
    "items": [
      {
        "_id": "65c000000000000000000011",
        "product": {...},
        "quantity": 3,
        "size": "L",
        "color": "red",
        "price": 150
      }
    ]
  }
}
```

#### Remove from Cart
```javascript
DELETE /api/cart/65c000000000000000000011

Response:
{
  "success": true,
  "data": {
    "_id": "65c000000000000000000010",
    "items": []
  }
}
```

#### Clear Cart
```javascript
DELETE /api/cart

Response:
{
  "success": true,
  "message": "Cart cleared"
}
```

### 4. Orders APIs

All routes are protected

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders/` | Create new order |
| GET | `/orders/my-orders` | Get user's orders |
| GET | `/orders/:id` | Get order by ID |
| PUT | `/orders/:id/pay` | Update order to paid |

#### Create Order
```javascript
POST /api/orders
{
  "shippingAddress": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "pincode": "10001"
  },
  "paymentMethod": "COD"
}

Response:
{
  "success": true,
  "data": {
    "_id": "65c000000000000000000020",
    "user": "65c000000000000000000000",
    "orderItems": [...],
    "shippingAddress": {...},
    "paymentMethod": "COD",
    "itemsPrice": 300,
    "shippingPrice": 50,
    "taxPrice": 54,
    "totalPrice": 404,
    "status": "Processing"
  }
}
```

#### Get My Orders
```javascript
GET /api/orders/my-orders

Response:
{
  "success": true,
  "data": [
    {
      "_id": "65c000000000000000000020",
      "orderItems": [...],
      "totalPrice": 404,
      "status": "Delivered",
      "createdAt": "2024-01-01T10:00:00.000Z"
    },
    {...}
  ]
}
```

#### Get Order by ID
```javascript
GET /api/orders/65c000000000000000000020

Response:
{
  "success": true,
  "data": {
    "_id": "65c000000000000000000020",
    "user": {...},
    "orderItems": [...],
    "shippingAddress": {...},
    "totalPrice": 404,
    "status": "Processing",
    "paymentMethod": "COD"
  }
}
```

#### Update Order to Paid
```javascript
PUT /api/orders/65c000000000000000000020/pay
{
  "id": "payment_123",
  "status": "succeeded",
  "update_time": "2024-01-01T10:30:00.000Z",
  "email_address": "john@example.com"
}

Response:
{
  "success": true,
  "data": {
    "_id": "65c000000000000000000020",
    "isPaid": true,
    "paidAt": "2024-01-01T10:30:00.000Z",
    "paymentResult": {...}
  }
}
```

### 5. Wishlist APIs

All routes are protected

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wishlist/` | Get user's wishlist |
| POST | `/wishlist/:productId` | Add product to wishlist |
| DELETE | `/wishlist/:productId` | Remove product from wishlist |
| GET | `/wishlist/check/:productId` | Check if product is in wishlist |
| DELETE | `/wishlist/` | Clear entire wishlist |

#### Get Wishlist
```javascript
GET /api/wishlist?page=1&limit=8

Response:
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "65c000000000000000000001",
        "name": "Casual Shirt",
        "price": 150,
        "images": [...]
      }
    ],
    "page": 1,
    "pages": 1,
    "total": 1
  }
}
```

#### Add to Wishlist
```javascript
POST /api/wishlist/65c000000000000000000001

Response:
{
  "success": true,
  "message": "Added to wishlist",
  "data": {
    "products": [...],
    "total": 1
  }
}
```

#### Remove from Wishlist
```javascript
DELETE /api/wishlist/65c000000000000000000001

Response:
{
  "success": true,
  "message": "Removed from wishlist",
  "data": {
    "products": [...],
    "total": 0
  }
}
```

#### Check Wishlist
```javascript
GET /api/wishlist/check/65c000000000000000000001

Response:
{
  "success": true,
  "data": {
    "isInWishlist": true
  }
}
```

#### Clear Wishlist
```javascript
DELETE /api/wishlist

Response:
{
  "success": true,
  "message": "Wishlist cleared"
}
```

### 6. Payment APIs

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/payment/create-payment-intent` | Create Stripe payment intent | Yes |
| GET | `/payment/config` | Get Stripe public key | No |

#### Create Payment Intent
```javascript
POST /api/payment/create-payment-intent
{
  "amount": 40400 // Amount in cents (₹404.00)
}

Response:
{
  "success": true,
  "data": {
    "clientSecret": "pi_123_secret_456"
  }
}
```

#### Get Stripe Config
```javascript
GET /api/payment/config

Response:
{
  "success": true,
  "data": {
    "publicKey": "pk_test_123"
  }
}
```

### 7. Upload APIs

All routes are protected (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload/` | Upload single image to Cloudinary |
| POST | `/upload/multiple` | Upload multiple images to Cloudinary |
| DELETE | `/upload/delete` | Delete image from Cloudinary |

#### Upload Single Image
```javascript
POST /api/upload
Content-Type: multipart/form-data

Body:
image: [file]

Response:
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/.../image.jpg",
    "publicId": "image_123",
    "altText": "image.jpg"
  }
}
```

#### Upload Multiple Images
```javascript
POST /api/upload/multiple
Content-Type: multipart/form-data

Body:
images: [file1, file2]

Response:
{
  "success": true,
  "data": [
    {
      "url": "https://res.cloudinary.com/.../image1.jpg",
      "publicId": "image1_123",
      "altText": "image1.jpg"
    },
    {...}
  ]
}
```

#### Delete Image
```javascript
DELETE /api/upload/delete
{
  "publicId": "image_123"
}

Response:
{
  "success": true,
  "message": "Image deleted successfully"
}
```

### 8. Admin APIs

All routes require admin privileges

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Get dashboard statistics |
| GET | `/admin/users` | Get all users |
| POST | `/admin/users` | Create user |
| PUT | `/admin/users/:id` | Update user |
| DELETE | `/admin/users/:id` | Delete user |
| GET | `/admin/orders` | Get all orders |
| PUT | `/admin/orders/:id/status` | Update order status |

#### Get Dashboard Stats
```javascript
GET /api/admin/stats

Response:
{
  "success": true,
  "data": {
    "totalRevenue": 15000,
    "totalOrders": 100,
    "totalProducts": 50,
    "totalUsers": 200,
    "recentOrders": [...],
    "ordersByStatus": [...]
  }
}
```

#### Get All Users
```javascript
GET /api/admin/users?page=1&limit=10

Response:
{
  "success": true,
  "data": {
    "users": [...],
    "page": 1,
    "pages": 20,
    "total": 200
  }
}
```

#### Create User
```javascript
POST /api/admin/users
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}

Response:
{
  "success": true,
  "data": {
    "_id": "65c000000000000000000030",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### Update User
```javascript
PUT /api/admin/users/65c000000000000000000030
{
  "name": "Updated Admin",
  "email": "admin@example.com",
  "role": "admin"
}

Response:
{
  "success": true,
  "data": {
    "_id": "65c000000000000000000030",
    "name": "Updated Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### Delete User
```javascript
DELETE /api/admin/users/65c000000000000000000030

Response:
{
  "success": true,
  "message": "User removed"
}
```

#### Get All Orders
```javascript
GET /api/admin/orders?page=1&limit=10

Response:
{
  "success": true,
  "data": {
    "orders": [...],
    "page": 1,
    "pages": 10,
    "total": 100
  }
}
```

#### Update Order Status
```javascript
PUT /api/admin/orders/65c000000000000000000020/status
{
  "status": "Delivered"
}

Response:
{
  "success": true,
  "data": {
    "_id": "65c000000000000000000020",
    "status": "Delivered",
    "deliveredAt": "2024-01-02T10:00:00.000Z"
  }
}
```

## Response Format

All API responses follow this format:

```javascript
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message"
}
```

Error responses:
```javascript
{
  "success": false,
  "message": "Error description"
}
```

## Pagination

Some endpoints support pagination:
- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: varies by endpoint)

Example: `GET /api/products?page=2&limit=20`

## Rate Limiting

- 2000 requests per 15 minutes per IP
- Status code 429 for too many requests

## Environment Variables

Backend requires:
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing key
- `STRIPE_SECRET_KEY`: Stripe payment secret
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

## Testing Instructions

1. Start backend server: `cd backend && npm run dev`
2. Use tools like Postman, Insomnia, or curl to test endpoints
3. For protected routes, first login to get session cookies
4. Frontend runs on http://localhost:5173

## Health Check

```javascript
GET /
Response: {
  "message": "Markrin E-Commerce API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "products": "/api/products",
    "cart": "/api/cart",
    "orders": "/api/orders",
    "admin": "/api/admin",
    "wishlist": "/api/wishlist"
  }
}
```
