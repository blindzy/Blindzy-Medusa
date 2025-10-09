import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseExtra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    // 👇 Add this block to control connection pooling
    databaseDriverOptions: {
      pool: {
        min: 1, // minimum number of idle connections
        max: 10, // maximum concurrent connections per instance
        idleTimeoutMillis: 30000, // close idle connections after 30s
      },
    },

    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    databaseSchema: "public",
    databaseLogging: true,
  },

  modules: {
    customer: {
      resolve: "@medusajs/customer",
      options: {},
    },
  },

  admin: {
    vite: () => {
      return {
        server: {
          allowedHosts: ["api.blindzy.com"],
        },
      }
    },
  },
})
