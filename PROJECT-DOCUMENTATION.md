# Blindzy Medusa E-commerce Platform - Complete Documentation

## 🌟 Project Overview

Blindzy Medusa is a comprehensive e-commerce platform built specifically for custom product sales. It's designed to handle complex product customizations with multiple options while providing a seamless shopping experience for customers. The platform combines the power of Medusa.js framework with custom-built features tailored for businesses that sell personalized products.

## 🏗️ System Architecture

### Technology Stack

The platform is built on modern, scalable technologies:

- **Backend Framework**: Medusa.js v2.8.8 - A robust e-commerce framework that provides core functionality
- **Language**: TypeScript for type-safe development
- **Database**: PostgreSQL with MikroORM v6.4.3 for advanced object-relational mapping
- **Authentication**: JWT-based authentication with publishable API keys
- **Email Service**: Resend API for transactional emails
- **File Storage**: Local file uploads with multer
- **API Testing**: Comprehensive Postman collection with 39 endpoints
- **Development Environment**: Docker containerization for consistent deployments

### Core Features

1. **Custom Product Management**: Complex product creation with multiple customization options
2. **Customer Account System**: Full registration, login, and profile management
3. **Shopping Cart**: Add, remove, update items with customer association
4. **Order Management**: Complete order processing from creation to tracking
5. **Address Management**: Multiple addresses per customer with default settings
6. **Email Notifications**: OTP verification and password reset functionality
7. **Admin Dashboard**: Product management and order oversight
8. **API-First Design**: Complete REST API for frontend integration

## 📊 Database Structure

### Custom Entities (11 Total)

The system uses a well-designed database schema with custom entities that extend Medusa's core functionality:

#### Customer Management
- **Customer Entity**: Extended with username, password hash, and custom fields
- **Customer Address Entity**: Multiple addresses with default shipping/billing flags
- **OTP Entity**: Email verification and password reset codes

#### Product System
- **Product Entity**: Custom products with complex customization options
- **Customization Option Entity**: Categories of customization (e.g., color, size, material)
- **Customization Value Entity**: Specific values for each option (e.g., red, blue, green)

#### Shopping & Orders
- **Cart Entity**: Customer shopping carts with item management
- **Cart Item Entity**: Individual items in cart with customization details
- **User Order Entity**: Complete order tracking with status management

#### Additional Features
- **Password Reset Entity**: Secure password reset token management
- **Sample Entity**: Product samples for customer evaluation

### Database Tables

The Setup.sql file creates over 100 tables including:
- All Medusa core tables (orders, products, customers, payments, etc.)
- Custom tables for extended functionality
- Proper foreign key relationships and constraints
- Performance optimizations with indexes

## 🔌 API Endpoints

### Admin APIs (Product Management)

**Custom Product Creation**
- `POST /admin/products/custom_product`
- Creates products with complex customization options
- Handles image uploads and metadata
- Auto-creates database tables if needed

### Store APIs (Customer-Facing)

#### Authentication & Account Management
- `POST /store/customers/register` - Customer registration with email verification
- `POST /store/customers/login` - Login with username/email and password
- `POST /store/customers/verify-otp` - Email verification using OTP codes
- `POST /store/customers/send-reset-email` - Password reset email
- `POST /store/customers/reset-password` - Password reset with token

#### Profile Management
- `GET /store/customers/get-customer` - Get customer profile
- `PUT /store/customers/update-customer` - Update customer information
- `POST /store/customers/user-pfp` - Upload profile picture

#### Address Management
- `GET /store/customers/addresses` - List all customer addresses
- `POST /store/customers/addresses` - Add new address
- `PUT /store/customers/addresses/[id]` - Update existing address
- `DELETE /store/customers/addresses/[id]` - Remove address

#### Shopping Cart
- `GET /store/customers/cart` - Get customer's cart
- `POST /store/customers/cart` - Add item to cart
- `PUT /store/customers/cart/[id]` - Update cart item
- `DELETE /store/customers/cart/[id]` - Remove cart item
- `DELETE /store/customers/cart/clear` - Empty entire cart

#### Order Management
- `GET /store/customers/order` - List customer orders
- `POST /store/customers/order` - Create new order
- `GET /store/customers/order/[id]` - Get specific order details

#### Additional Features
- `POST /store/customers/contact` - Contact form submission
- `GET /store/customers/samples/get-all` - View available samples
- `GET /store/customers/samples/get-one/[id]` - Get specific sample

## 🔐 Authentication System

### Two-Layer Authentication

1. **Admin Authentication**: JWT tokens for admin panel access
2. **Store Authentication**: Publishable API keys for customer-facing operations

### Security Features

- Password hashing using bcrypt
- JWT token validation
- OTP-based email verification
- Secure password reset flow
- API key authentication for store endpoints

## 🛠️ Development Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Docker (optional but recommended)

### Quick Start

1. **Database Setup**
   ```bash
   # Run the Setup.sql file to create database and tables
   psql -U postgres -f Setup.sql
   ```

2. **Environment Configuration**
   ```bash
   # Set up environment variables
   DATABASE_URL=postgresql://medusa_user:admin123@localhost:5432/medusa_db
   JWT_SECRET=your-jwt-secret
   COOKIE_SECRET=your-cookie-secret
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### Docker Setup

```bash
# Start with Docker Compose
docker-compose up -d

# Or use the development compose file
docker-compose -f docker-compose.dev.yml up
```

## 📁 Project Structure

### Source Code Organization

```
src/
├── api/                 # API route handlers
│   ├── admin/          # Admin-only endpoints
│   └── store/          # Customer-facing endpoints
├── entities/           # Database entity definitions
├── utils/              # Helper functions and utilities
├── models/             # Custom data models
└── workflows/          # Business logic workflows
```

### Key Files

- **medusa-config.ts**: Main configuration file
- **Setup.sql**: Complete database schema
- **postman-collection.json**: API testing collection
- **docker-compose.yml**: Container orchestration
- **package.json**: Dependencies and scripts

## 🎯 Business Logic

### Custom Product Flow

1. **Product Creation**: Admin creates product with customization options
2. **Option Definition**: Multiple customization categories (color, size, material)
3. **Value Assignment**: Specific values for each customization option
4. **Image Management**: Multiple product images with proper organization
5. **Pricing**: Flexible pricing structure for different configurations

### Customer Journey

1. **Registration**: Email-based registration with OTP verification
2. **Profile Setup**: Complete profile with multiple addresses
3. **Shopping**: Browse products, view customization options
4. **Cart Management**: Add items with specific customizations
5. **Checkout**: Order creation with address and payment details
6. **Order Tracking**: Real-time order status updates

### Order Processing

1. **Order Creation**: Convert cart to order with proper validation
2. **Status Management**: Track orders through multiple states
3. **Fulfillment**: Integration with shipping and payment systems
4. **Customer Communication**: Automated email notifications

## 🔧 Customization Features

### Product Customization

- **Multiple Option Types**: Color, size, material, finish, etc.
- **Value Hierarchies**: Organized option values with pricing tiers
- **Image Variants**: Different images for different customizations
- **Inventory Tracking**: Stock management per customization combination

### Customer Experience

- **Visual Customization**: Real-time preview of customization options
- **Price Calculation**: Dynamic pricing based on selected options
- **Saved Configurations**: Customers can save preferred customizations
- **Sample Requests**: Physical samples for material/color verification

## 📧 Email Integration

### Automated Communications

- **Welcome Emails**: New customer registration confirmation
- **OTP Verification**: Email address verification codes
- **Password Reset**: Secure password reset links
- **Order Confirmations**: Detailed order summaries
- **Status Updates**: Order progress notifications

### Email Service

- **Provider**: Resend API for reliable delivery
- **Templates**: Professional email templates
- **Tracking**: Delivery and open rate monitoring

## 🧪 Testing & Quality Assurance

### API Testing

- **Postman Collection**: 39 comprehensive test cases
- **Environment Variables**: Configurable test environments
- **Automated Testing**: Script-based API validation
- **Error Handling**: Comprehensive error response testing

### Development Tools

- **TypeScript**: Type safety and better development experience
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Hot Reload**: Instant development feedback

## 🚀 Deployment & Production

### Production Readiness

- **Docker Containers**: Consistent deployment across environments
- **Environment Configuration**: Proper secret management
- **Database Migrations**: Automated schema updates
- **Health Checks**: System monitoring and alerting

### Scaling Considerations

- **Database Optimization**: Proper indexing and query optimization
- **Caching Strategy**: Redis integration for performance
- **CDN Integration**: Static asset delivery
- **Load Balancing**: Multi-instance deployment support

## 📈 Performance & Monitoring

### Database Performance

- **Optimized Queries**: Efficient data retrieval
- **Proper Indexing**: Fast search and filtering
- **Connection Pooling**: Efficient database connections
- **Query Logging**: Performance monitoring

### Application Monitoring

- **Health Endpoints**: System status checking
- **Error Logging**: Comprehensive error tracking
- **Performance Metrics**: Response time monitoring
- **Resource Usage**: Memory and CPU tracking

## 🔮 Future Enhancements

### Planned Features

1. **Advanced Analytics**: Customer behavior tracking
2. **AI Recommendations**: Personalized product suggestions
3. **Mobile App**: React Native application
4. **Advanced Customization**: 3D product visualization
5. **Multi-vendor Support**: Marketplace functionality

### Technical Improvements

1. **GraphQL API**: Alternative to REST endpoints
2. **Microservices**: Service decomposition for better scalability
3. **Event Sourcing**: Better audit trail and data consistency
4. **Advanced Caching**: Multi-layer caching strategy

## 📞 Support & Maintenance

### Documentation

- **API Documentation**: Complete endpoint documentation
- **Setup Guides**: Step-by-step installation instructions
- **Troubleshooting**: Common issues and solutions
- **Best Practices**: Development and deployment guidelines

### Maintenance Tasks

- **Regular Updates**: Framework and dependency updates
- **Security Patches**: Timely security fixes
- **Performance Optimization**: Ongoing performance improvements
- **Feature Enhancements**: Continuous feature development

---
