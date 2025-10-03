import { Request, Response } from 'express'
import { initORM } from "../../../../../utils/orm";
import { StandardProduct } from "../../../../../entities/standard-product.entity";

// GET /store/products/custom/[id] - Get specific product by ID
export async function GET(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required"
      });
    }

    console.log(`Fetching product details for ID: ${id}`);
    
    const orm = await initORM();
    const em = orm.em.fork();

    // Get the product (excluding deleted ones)
    const product = await em.findOne(StandardProduct, { 
      id,
      deleted_at: null 
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }

    console.log(`Found product: ${product.title}`);

    res.status(200).json({
      success: true,
      product: product
    });

  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch product details",
      details: error.message
    });
  }
}
