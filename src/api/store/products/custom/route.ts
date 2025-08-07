import { Request, Response } from 'express'
import { initORM } from "../../../../utils/orm";
import { Product } from "../../../../entities/product.entity";
import { CustomizationOption } from "../../../../entities/customization_option.entity";
import { CustomizationValue } from "../../../../entities/customization_value.entity";

// GET /store/products/custom - Get all custom products with basic info
export async function GET(req: Request, res: Response) {
  try {
    console.log("Fetching all custom products for store...");
    
    const orm = await initORM();
    const em = orm.em.fork();

    // Get all products
    const products = await em.find(Product, {});

    // Get customization options count for each product
    const productsData = await Promise.all(
      products.map(async (product) => {
        const optionsCount = await em.count(CustomizationOption, {
          product_id: product.id
        });

        return {
          id: product.id,
          title: product.title,
          description: product.description,
          type: product.type,
          base_price: product.base_price,
          image_url: product.image_url,
          customization_options_available: optionsCount,
          created_at: product.created_at
        };
      })
    );

    console.log(`Found ${productsData.length} custom products`);

    res.status(200).json({
      success: true,
      products: productsData,
      total_count: productsData.length
    });

  } catch (error) {
    console.error("Error fetching custom products:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch custom products",
      details: error.message
    });
  }
}
