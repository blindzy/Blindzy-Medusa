# Blindzy Medusa - Development Setup

This project uses **Vercel's Supabase PostgreSQL database** for both local development and production, eliminating the need for local database containers.

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd Blindzy-Medusa
npm install
```

### 2. Environment Setup
```bash
# Copy the environment template
cp env.local.example .env.local
```

The `.env.local` file is already configured with the shared Supabase database credentials.

### 3. Start Development
```bash
npm run dev
```

Your Medusa server will be available at:
- **API**: http://localhost:9000
- **Admin Panel**: http://localhost:9000/app

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Supabase database |
| `npm run setup` | Install dependencies and show setup instructions |
| `npm run build` | Build the project for production |
| `npm run start` | Start production server |
| `npm run docker:dev` | Run with Docker (optional) |

## 🗄️ Database Configuration

### Shared Supabase Database
- **Host**: `db.oxrvlavisziyoirswhmf.supabase.co`
- **Database**: `postgres`
- **Connection**: Automatically configured via environment variables

### Benefits of Shared Database:
✅ **No local setup required** - Just clone and run  
✅ **Team synchronization** - Everyone works with the same data  
✅ **Production parity** - Same database engine and configuration  
✅ **Instant collaboration** - Changes are immediately visible to all team members  

## 🔧 API Endpoints

### Products API
- **GET** `/api/store/products/custom` - Get all products
- **GET** `/api/store/products/custom/[id]` - Get specific product by ID

### Admin Panel
- **URL**: http://localhost:9000/app
- **Features**: Product management, orders, customers

## 🐳 Docker (Optional)

If you prefer containerized development:

```bash
# Build and run with Docker
npm run docker:build
npm run docker:dev
```

Note: The PostgreSQL container is disabled since we use the remote Supabase database.

## 🌐 Database Access

### Supabase Dashboard
- **URL**: https://oxrvlavisziyoirswhmf.supabase.co
- **Access**: Use the provided Supabase credentials

### Direct Database Connection
You can connect to the database using any PostgreSQL client:
```
Host: db.oxrvlavisziyoirswhmf.supabase.co
Port: 5432
Database: postgres
Username: postgres
Password: [from environment variables]
```

## 🔒 Environment Variables

All necessary environment variables are pre-configured in `env.local.example`. Key variables:

- `DATABASE_URL` - Primary database connection
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Public API key
- `SUPABASE_SERVICE_ROLE_KEY` - Admin API key

## 🚨 Important Notes

1. **Shared Database**: All team members work with the same database instance
2. **Data Persistence**: Changes made by one developer are visible to all others
3. **Be Careful**: Avoid destructive operations that might affect other team members
4. **Backup**: The database is managed by Supabase with automatic backups

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Check if environment variables are loaded
echo $DATABASE_URL

# Test database connection
npm run dev
# Look for "Fetching all products for store..." in logs
```

### Port Already in Use
```bash
# Kill process on port 9000
npx kill-port 9000

# Or use different port
PORT=9001 npm run dev
```

### Missing Environment File
```bash
# Make sure .env.local exists
ls -la .env.local

# If missing, copy from template
cp env.local.example .env.local
```

## 🤝 Team Collaboration

Since everyone shares the same database:

1. **Communicate changes** that might affect others
2. **Use descriptive commit messages** for database-related changes
3. **Test thoroughly** before pushing changes
4. **Coordinate** when making schema changes

## 📞 Support

If you encounter issues:
1. Check the console logs for database connection errors
2. Verify your `.env.local` file exists and has correct values
3. Ensure you have internet connection (required for Supabase)
4. Contact the team lead for database access issues
