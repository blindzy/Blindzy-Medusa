import type { AdminProductDetailsWidgetProps, ProductDetailsWidgetConfig } from "@medusajs/admin-shared"

const CustomProductWidget = ({ product }: AdminProductDetailsWidgetProps) => {
  return (
    <div>
      <h3>Custom Product Options</h3>
      <p>Product ID: {product.id}</p>
      {/* Add your custom product creation form here */}
    </div>
  )
}

export const config: ProductDetailsWidgetConfig = {
  zone: "product.details.after",
}

export default CustomProductWidget
