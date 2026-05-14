# Blindzy Medusa Backend

This is a heavily customized Medusa v2 application designed for the Blindzy e-commerce platform. It includes a custom authentication system, a complex product customization engine, and direct MikroORM integrations.

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/) (Optional, for caching)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Blindzy-Medusa
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    Copy `.env.template` (if available) or create a `.env` file in the root directory and add the following:
    ```env
    DATABASE_URL=postgres://user:password@localhost:5432/medusa
    JWT_SECRET=supersecret
    COOKIE_SECRET=supersecret
    STORE_CORS=http://localhost:8000
    ADMIN_CORS=http://localhost:7001
    AUTH_CORS=http://localhost:8000
    STRIPE_API_KEY=your_stripe_key
    RESEND_API_KEY=your_resend_key
    ```

4.  **Run migrations:**
    ```bash
    npx medusa migrations run
    ```

5.  **Start development server:**
    ```bash
    npm run dev
    ```

## 📂 Project Structure

- `src/admin`: Custom admin dashboard widgets and extensions.
- `src/api`: Custom API routes for both store and admin.
  - `src/api/store/customers`: Custom authentication flow (OTP, Register, Login, etc.).
  - `src/api/admin/products/custom_product`: Management of complex customized products.
- `src/entities`: Custom MikroORM entities used throughout the application.
- `src/utils`:
  - `orm.ts`: Direct MikroORM initialization for database communication.
  - `otp.ts`: OTP generation and storage logic.
  - `resend-client.ts`: Email delivery via Resend.
  - `crypto.ts`: Password hashing and security utilities.
- `uploads/`: Directory for file uploads (base64 images).

## ✨ Key Customizations

### 1. Custom Authentication Flow
The application bypasses standard Medusa auth for customers in favor of a specialized OTP-based flow:
- **Registration**: Creates a customer and sends a verification OTP via Resend.
- **OTP Verification**: Verifies email address using a temporary OTP stored in the `otp` table.
- **Password Management**: Custom routes for password reset and email-based recovery.
- **Profile Management**: Custom endpoints for updating customer details and profile pictures.

### 2. Custom Product Engine
Designed for products that require extensive user customization (e.g., blinds):
- **Dynamic Options**: Products can have multiple `CustomizationOption` (Color, Fabric, Size).
- **Price Modifiers**: Each choice within an option can have an `additional_price` that affects the final product cost.
- **Complex Models**: Uses `Product`, `CustomizationOption`, and `CustomizationValue` entities to represent the product structure.

### 3. Direct ORM Integration
While utilizing the Medusa framework, some custom routes use `initORM()` from `src/utils/orm.ts` to perform direct MikroORM operations. This allows for complex queries and transactions outside the standard Medusa Service layer.

### 4. File Handling
Includes a utility to handle base64 image uploads directly from API requests, saving them to the `uploads/` directory and returning the relative path for database storage.

## 🛠 Development Commands

- `npm run dev`: Starts the Medusa development server.
- `npm run build`: Builds the project for production.
- `npx medusa migrations run`: Applies database migrations.
- `npx medusa migrations create`: Creates a new database migration.

## 📄 Documentation & Resources

- [Medusa v2 Documentation](https://docs.medusajs.com/v2)
- [MikroORM Documentation](https://mikro-orm.io/docs/v6)
- [Resend Documentation](https://resend.com/docs)
