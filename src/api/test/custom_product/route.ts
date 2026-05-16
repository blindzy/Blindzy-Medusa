import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'

interface CustomProductRequest {
  title: string
  description?: string
  base_price: number
  type: string
  customizations: Array<{
    name: string
    input_type: string
    required: boolean
    values: Array<{
      value: string
      image_url?: string
      additional_price?: number
    }>
  }>
}

// Simple test endpoint - No database operations for now
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    res.status(200).json({
      products: [
        {
          id: "test-1",
          title: "Sample Roller Blind",
          type: "Roller",
          base_price: 99.99,
          customizations: [
            {
              id: "opt-1",
              name: "Color",
              input_type: "select",
              required: true,
              values: [
                { id: "val-1", value: "White", additional_price: 0 },
                { id: "val-2", value: "Black", additional_price: 5.00 }
              ]
            }
          ]
        }
      ],
      success: true,
      message: 'Test endpoint working - CORS enabled for localhost:4321'
    })
  } catch (error) {
    console.error('Error in test endpoint:', error)
    res.status(500).json({
      error: 'Test endpoint failed.',
      success: false
    })
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
    customizations = []
  } = req.body as any

  // Basic validation
  if (!title || !base_price || !type) {
    return res.status(400).json({
      error: 'Title, base_price, and type are required fields.',
      success: false
    })
  }

  try {
    // Simulate successful creation
    const mockProduct = {
      id: `product-${Date.now()}`,
      title,
      description,
      type,
      base_price,
      customizations: customizations.map((custom, index) => ({
        id: `option-${index}`,
        ...custom,
        values: custom.values?.map((val, valIndex) => ({
          id: `value-${index}-${valIndex}`,
          ...val
        })) || []
      })),
      created_at: new Date().toISOString()
    }

    res.status(201).json({ 
      message: 'Custom product created successfully (test endpoint).',
      success: true,
      product: mockProduct
    })
  } catch (error) {
    console.error('Error creating custom product:', error)
    
    res.status(500).json({ 
      error: 'Failed to create custom product.',
      success: false 
    })
  }
}
