import { Request, Response } from 'express'
import { initORM } from "../../../../../utils/orm";
import { Product } from "../../../../../entities/product.entity";
import { CustomizationOption } from "../../../../../entities/customization_option.entity";
import { CustomizationValue } from "../../../../../entities/customization_value.entity";

// GET /store/products/custom/[id] - Get specific product with all customization options
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

    // Get the product
    const product = await em.findOne(Product, { id });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }

    // Get all customization options for this product
    const customizationOptions = await em.find(CustomizationOption, {
      product_id: product.id
    });

    // Get all customization values for these options
    const optionsWithChoices = await Promise.all(
      customizationOptions.map(async (option) => {
        const choices = await em.find(CustomizationValue, {
          option_id: option.id
        });

        // Parse the combined value field back to structured data
        const parsedChoices = choices.map(choice => {
          const [choice_label, choice_value, defaultFlag] = choice.value.split('|');
          return {
            id: choice.id,
            choice_label: choice_label,
            choice_value: choice_value,
            image_url: choice.image_url,
            price_modifier: choice.additional_price || 0,
            is_default: defaultFlag === 'default'
          };
        });

        // Sort choices: default choices first
        parsedChoices.sort((a, b) => {
          if (a.is_default && !b.is_default) return -1;
          if (!a.is_default && b.is_default) return 1;
          return 0;
        });

        return {
          id: option.id,
          option_name: option.name,
          input_type: option.input_type,
          required: option.required,
          choices: parsedChoices
        };
      })
    );

    // Calculate total choices across all options
    const totalChoices = optionsWithChoices.reduce((sum, option) => sum + option.choices.length, 0);

    const productData = {
      id: product.id,
      title: product.title,
      description: product.description,
      type: product.type,
      base_price: product.base_price,
      image_url: product.image_url,
      created_at: product.created_at,
      updated_at: product.updated_at,
      customization_options: optionsWithChoices,
      total_customization_options: optionsWithChoices.length,
      total_choices: totalChoices
    };

    console.log(`Found product with ${optionsWithChoices.length} customization options and ${totalChoices} total choices`);

    res.status(200).json({
      success: true,
      product: productData
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
