import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { MedusaError } from '@medusajs/framework/utils'
import { Product } from '../../../../entities/product.entity'
import { CustomizationOption } from '../../../../entities/customization_option.entity'
import { CustomizationValue } from '../../../../entities/customization_value.entity'
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs'
import * as path from 'path'
import { initORM } from '../../../../utils/orm'

interface CustomProductRequest {
  title: string
  description?: string
  base_price: number
  type: string
  product_image_url?: string
  customization_options: Array<{
    option_name: string           // e.g., "Color", "Fabric", "Style", "Size"
    input_type: string           // e.g., "select", "color_picker", "text_input"
    required: boolean            // Whether this option is mandatory
    display_order?: number       // Order to display options
    choices: Array<{
      choice_label: string       // e.g., "Royal Blue", "Cotton Blend", "Modern"
      choice_value: string       // Internal value for processing
      image_url?: string         // Preview image for this choice
      price_modifier: number     // Additional cost (+/-) for this choice
      is_default?: boolean       // Default selected choice
    }>
  }>
}

// Helper function to save base64 image to uploads folder
const saveImageToUploads = (base64Data: string, filename: string): string => {
  try {
    // Remove data:image/jpeg;base64, prefix if present
    const base64Image = base64Data.replace(/^data:image\/[a-z]+;base64,/, '')
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    
    // Generate unique filename
    const uniqueFilename = `${uuidv4()}_${filename}`
    const filePath = path.join(uploadsDir, uniqueFilename)
    
    // Save the image
    fs.writeFileSync(filePath, base64Image, 'base64')
    
    // Return the relative path for storage in database
    return `/uploads/${uniqueFilename}`
  } catch (error) {
    console.error('Error saving image:', error)
    throw new Error('Failed to save image')
  }
}

export const POST = async (
  req: MedusaRequest<CustomProductRequest>, 
  res: MedusaResponse
) => {
  const {
    title,
    description,
    base_price,
    type,
    product_image_url,
    customization_options = []
  } = req.body as any

  // Basic validation
  if (!title || !base_price || !type) {
    return res.status(400).json({
      error: 'Title, base_price, and type are required fields.',
      success: false
    })
  }

  // Validate base_price is a number
  if (typeof base_price !== 'number' || base_price < 0) {
    return res.status(400).json({
      error: 'base_price must be a positive number.',
      success: false
    })
  }

  // Validate customization options structure
  for (const option of customization_options) {
    if (!option.option_name || !option.input_type || !option.choices?.length) {
      return res.status(400).json({
        error: 'Each customization option must have option_name, input_type, and at least one choice.',
        success: false
      })
    }
  }

  try {
    let createdProduct;
    let savedProductImageUrl = product_image_url;

    // Handle product image upload if it's base64
    if (product_image_url && product_image_url.startsWith('data:image/')) {
      try {
        savedProductImageUrl = saveImageToUploads(product_image_url, 'product_image.jpg');
      } catch (imageError) {
        return res.status(400).json({
          error: 'Failed to process product image.',
          success: false
        })
      }
    }

    // Initialize ORM connection
    const orm = await initORM()
    const em = orm.em.fork()

    // Create all required tables if they don't exist
    try {
      // Create custom_product table
      await em.getConnection().execute(`
        CREATE TABLE IF NOT EXISTS custom_product (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          type TEXT NOT NULL,
          base_price DECIMAL(10,2) NOT NULL,
          image_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        )
      `)

      // Create customization_option table
      await em.getConnection().execute(`
        CREATE TABLE IF NOT EXISTS customization_option (
          id TEXT PRIMARY KEY,
          product_id TEXT NOT NULL,
          name TEXT NOT NULL,
          input_type TEXT NOT NULL,
          required BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `)

      // Create customization_value table  
      await em.getConnection().execute(`
        CREATE TABLE IF NOT EXISTS customization_value (
          id TEXT PRIMARY KEY,
          option_id TEXT NOT NULL,
          value TEXT NOT NULL,
          image_url TEXT,
          additional_price DECIMAL(10,2) DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `)

      // Add foreign key constraints if they don't exist
      await em.getConnection().execute(`
        DO $$ 
        BEGIN 
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'customization_option_product_id_fkey'
          ) THEN
            ALTER TABLE customization_option 
            ADD CONSTRAINT customization_option_product_id_fkey 
            FOREIGN KEY (product_id) REFERENCES custom_product(id) ON DELETE CASCADE;
          END IF;
        END $$;
      `)

      await em.getConnection().execute(`
        DO $$ 
        BEGIN 
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'customization_value_option_id_fkey'
          ) THEN
            ALTER TABLE customization_value 
            ADD CONSTRAINT customization_value_option_id_fkey 
            FOREIGN KEY (option_id) REFERENCES customization_option(id) ON DELETE CASCADE;
          END IF;
        END $$;
      `)

      console.log('All required tables created successfully')
    } catch (tableError) {
      console.log('Table creation status:', tableError.message)
    }
    
    await em.transactional(async (transactionalManager) => {
      // Create the main product
      const product = transactionalManager.create(Product, {
        id: uuidv4(),
        title,
        description,
        type,
        base_price,
        image_url: savedProductImageUrl,
        created_at: new Date(),
        updated_at: new Date(),
      })

      await transactionalManager.persistAndFlush(product)
      createdProduct = product;

      // Create customization options and choices
      for (const [index, option] of customization_options.entries()) {
        // Validate option data
        if (!option.option_name || !option.input_type) {
          throw new Error(`Invalid customization option: option_name and input_type are required`)
        }

        const customizationOption = transactionalManager.create(CustomizationOption, {
          id: uuidv4(),
          name: option.option_name,
          input_type: option.input_type,
          required: option.required || false,
          product_id: product.id,
        })

        await transactionalManager.persistAndFlush(customizationOption)

        // Create choices for this option
        for (const choice of option.choices || []) {
          if (!choice.choice_label || choice.choice_value === undefined) {
            throw new Error(`Invalid choice: choice_label and choice_value are required`)
          }

          let savedImageUrl: string | undefined = choice.image_url;

          // Handle image upload for choice preview if it's base64
          if (choice.image_url && choice.image_url.startsWith('data:image/')) {
            try {
              savedImageUrl = saveImageToUploads(
                choice.image_url, 
                `${option.option_name}_${choice.choice_label}.jpg`
              );
            } catch (imageError) {
              console.warn(`Failed to process image for choice: ${choice.choice_label}`);
              // Continue without the image rather than failing the entire request
              savedImageUrl = undefined;
            }
          }

          const customizationValue = transactionalManager.create(CustomizationValue, {
            id: uuidv4(),
            option_id: customizationOption.id,
            value: `${choice.choice_label}|${choice.choice_value}${choice.is_default ? '|default' : ''}`,
            image_url: savedImageUrl,
            additional_price: choice.price_modifier || 0,
          })

          await transactionalManager.persistAndFlush(customizationValue)
        }
      }
    })

    // Close the ORM connection
    await orm.close()

    res.status(201).json({ 
      message: 'Custom product created successfully with all customization options.',
      success: true,
      product: {
        id: createdProduct?.id,
        title: createdProduct?.title,
        description: createdProduct?.description,
        type: createdProduct?.type,
        base_price: createdProduct?.base_price,
        image_url: createdProduct?.image_url,
        customization_options_count: customization_options.length,
        total_choices: customization_options.reduce((total, opt) => total + opt.choices.length, 0)
      }
    })
  } catch (error) {
    console.error('Error creating custom product:', error)
    
    if (error instanceof MedusaError) {
      return res.status(typeof error.code === 'number' ? error.code : 400).json({ 
        error: error.message,
        success: false 
      })
    }
    
    res.status(500).json({ 
      error: error.message || 'Failed to create custom product.',
      success: false 
    })
  }
}
