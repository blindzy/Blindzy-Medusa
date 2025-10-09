import { Request, Response } from 'express'
import { initORM } from "../../../../utils/orm";

// GET /store/products/custom - Get all products from standard Medusa product table
export async function GET(req: Request, res: Response) {
  try {
    console.log("Fetching full product data for store...");

    const orm = await initORM();
    const em = orm.em.fork();
    const conn = em.getConnection();

    // Aggregate Medusa product with variants, options, option values, tags, categories, collection, and type
    const sql = `
      SELECT
        p.*,
        -- variants with their option values and price set links
        COALESCE(
          (
            SELECT json_agg(
              to_jsonb(pv)
              || jsonb_build_object(
                'options', (
                  SELECT COALESCE(json_agg(json_build_object(
                    'id', pov.id,
                    'option_id', pov.option_id,
                    'value', pov.value
                  )), '[]'::json)
                  FROM product_variant_option pvo
                  JOIN product_option_value pov ON pov.id = pvo.option_value_id
                  WHERE pvo.variant_id = pv.id
                ),
                'price_sets', (
                  SELECT COALESCE(json_agg(json_build_object(
                    'price_set_id', pvps.price_set_id,
                    'prices', (
                      SELECT COALESCE(json_agg(json_build_object(
                        'id', pr.id,
                        'title', pr.title,
                        'currency_code', pr.currency_code,
                        'amount', pr.amount,
                        'raw_amount', pr.raw_amount,
                        'min_quantity', pr.min_quantity,
                        'max_quantity', pr.max_quantity,
                        'price_list_id', pr.price_list_id
                      )), '[]'::json)
                      FROM price pr
                      WHERE pr.price_set_id = pvps.price_set_id AND pr.deleted_at IS NULL
                    )
                  )), '[]'::json)
                  FROM product_variant_price_set pvps
                  WHERE pvps.variant_id = pv.id
                )
              )
            )
            FROM product_variant pv
            WHERE pv.product_id = p.id AND pv.deleted_at IS NULL
          ),
          '[]'::json
        ) AS variants,

        -- product options with their possible values
        COALESCE(
          (
            SELECT json_agg(
              to_jsonb(po)
              || jsonb_build_object(
                'values', (
                  SELECT COALESCE(json_agg(json_build_object(
                    'id', pov.id,
                    'value', pov.value
                  )), '[]'::json)
                  FROM product_option_value pov
                  WHERE pov.option_id = po.id
                )
              )
            )
            FROM product_option po
            WHERE po.product_id = p.id AND po.deleted_at IS NULL
          ),
          '[]'::json
        ) AS options,

        -- tags
        COALESCE(
          (
            SELECT json_agg(json_build_object('id', t.id, 'value', t.value))
            FROM product_tags jt
            JOIN product_tag t ON t.id = jt.product_tag_id
            WHERE jt.product_id = p.id
          ),
          '[]'::json
        ) AS tags,

        -- categories
        COALESCE(
          (
            SELECT json_agg(json_build_object('id', c.id, 'name', c.name, 'handle', c.handle))
            FROM product_category_product jpc
            JOIN product_category c ON c.id = jpc.product_category_id
            WHERE jpc.product_id = p.id
          ),
          '[]'::json
        ) AS categories,

        -- collection
        (
          SELECT to_json(pc)
          FROM product_collection pc
          WHERE pc.id = p.collection_id
        ) AS collection,

        -- type
        (
          SELECT to_json(pt)
          FROM product_type pt
          WHERE pt.id = p.type_id
        ) AS type

      FROM product p
      WHERE p.deleted_at IS NULL
      ORDER BY p.created_at DESC
    `;

    const products = await conn.execute(sql);

    res.status(200).json({
      success: true,
      products,
      total_count: products.length
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch products",
      details: (error as Error).message
    });
  }
}
