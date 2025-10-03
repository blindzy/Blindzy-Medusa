import { Request, Response } from 'express'
import { initORM } from "../../../../utils/orm";
import { StandardProduct } from "../../../../entities/standard-product.entity";

// GET /store/products/custom - Get all products from standard Medusa product table
export async function GET(req: Request, res: Response) {
  try {
    console.log("Fetching all products for store...");
    
    const orm = await initORM();
    const em = orm.em.fork();

    // Get all products from standard product table (excluding deleted ones)
    const products = await em.find(StandardProduct, {
      deleted_at: null
    });
    
    console.log(`Found ${products.length} products in standard product table`);

    res.status(200).json({
      success: true,
      products: products,
      total_count: products.length
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch products",
      details: error.message
    });
  }
}
