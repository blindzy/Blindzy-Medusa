//src/api/middlewares.ts
import { defineMiddlewares } from "@medusajs/framework/http"
import bodyParser from "body-parser"
import cors from "cors"

const corsOptions = {
  origin: process.env.STORE_CORS?.split(","),
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-publishable-api-key", "x-medusa-locale"],
  credentials: true,
}

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/upload/upload-pfp",
      method: "POST",
      middlewares: [
        // Override the default 100kb limit for this route only
        bodyParser.json({ limit: "10mb" }),
        cors(corsOptions)
      ],
    },
    {
      matcher: "/store/*",
      middlewares: [cors(corsOptions)],
    },
    {
      matcher: "/admin/*",
      middlewares: [cors(corsOptions)],
    },
  ]
})
