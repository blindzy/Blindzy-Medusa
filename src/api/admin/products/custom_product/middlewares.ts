import { defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/products/custom_product*",
      middlewares: [] 
    }
  ]
})
