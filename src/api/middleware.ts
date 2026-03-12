//src/api/middlewares.ts
import { defineMiddlewares } from "@medusajs/framework/http"
import bodyParser from "body-parser"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/upload/upload-pfp",
      method: "POST",
      middlewares: [
        // Override the default 100kb limit for this route only
        bodyParser.json({ limit: "10mb" }),
      ],
    },
  ]
})
