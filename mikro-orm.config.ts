import { defineConfig } from '@mikro-orm/postgresql'
import { loadEnv } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

export default defineConfig({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'medusa_user',
  password: process.env.DB_PASSWORD || 'admin123',
  dbName: process.env.DB_NAME || 'medusa_db',
  entities: [], // Temporarily disable custom entities
  entitiesTs: [], // Temporarily disable custom entities
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    path: './src/migrations',
    pathTs: './src/migrations',
  },
})
