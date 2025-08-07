# 📋 Complete API Collection Summary

## 🚀 Core APIs
- `GET /health` - Health check

## 🛠️ Admin APIs

### Authentication
- `POST /admin/users` - Create admin user
- `POST /admin/auth` - Admin login

### Custom Products
- `POST /admin/products/custom_product` - Create custom product

## 🛍️ Store APIs (Customer-facing)

### Products
- `GET /store/products/custom` - Get all custom products
- `GET /store/products/custom/{id}` - Get product details with customizations

### Customer Management
- `POST /store/customers/register` - Customer registration
- `POST /store/customers/login` - Customer login
- `GET /store/customers/get-customer` - Get customer details
- `POST /store/customers/get-customer` - Create/update customer data
- `PATCH /store/customers/update-customer` - Update customer info
- `POST /store/customers/verify-otp` - Verify OTP
- `POST /store/customers/send-reset-email` - Send password reset email
- `POST /store/customers/reset-password` - Reset password
- `POST /store/customers/contact` - Contact form submission
- `PATCH /store/customers/user-pfp` - Upload profile picture

### Address Management
- `POST /store/customers/addresses` - Create address
- `GET /store/customers/addresses` - Get all addresses
- `PUT /store/customers/addresses/{id}` - Update address
- `DELETE /store/customers/addresses/{id}` - Delete address

### Shopping Cart
- `GET /store/customers/cart` - Get cart
- `POST /store/customers/cart` - Add to cart
- `PUT /store/customers/cart/{id}` - Update cart item
- `DELETE /store/customers/cart/{id}` - Delete cart item
- `DELETE /store/customers/cart/clear` - Clear cart

### Payment Cards
- `POST /store/customers/card` - Add payment card
- `GET /store/customers/card` - Get all cards
- `GET /store/customers/card/{id}` - Get specific card
- `PUT /store/customers/card/{id}` - Update payment card
- `DELETE /store/customers/card/{id}` - Delete payment card

### Checkout & Orders
- `POST /store/customers/checkout` - Start checkout
- `POST /store/customers/checkout/calculate-shipping` - Calculate shipping
- `POST /store/customers/checkout/ship` - Complete checkout (Express router)
- `POST /store/customers/order` - Create order
- `GET /store/customers/order` - Get customer orders
- `GET /store/customers/order/{id}` - Get order details
- `PUT /store/customers/order/{id}` - Update order
- `DELETE /store/customers/order/{id}` - Delete order

### Samples
- `GET /store/customers/samples/get-all` - Get all samples
- `GET /store/customers/samples/get-one` - Get specific sample

## 🧪 Test APIs
- `GET /test/custom_product` - Test custom product GET
- `POST /test/custom_product` - Test custom product POST

---

## 📊 Total API Count: **39 Endpoints**

### Breakdown:
- **Core:** 1 endpoint
- **Admin:** 3 endpoints  
- **Store:** 34 endpoints
- **Test:** 2 endpoints

### Authentication:
- **Admin APIs:** Require admin token (except auth endpoints)
- **Store APIs:** Require publishable API key: `pk_c5c3a7c4c2f5e1c991a5feec30098bdaad87511c48b8f8a99cac999d528295aa`
- **Test APIs:** No authentication required

### Pre-configured Variables:
- `baseUrl`: http://localhost:9000
- `publishableKey`: Pre-filled with working key
- `productId`: Sample product ID for testing
- `adminToken`: For admin authentication
- Plus placeholder variables for IDs (addressId, cartItemId, cardId, orderId, etc.)

**📁 File Location:** `postman-collection.json`

**🚀 Import into Postman to test all endpoints with pre-configured authentication and sample data!**
