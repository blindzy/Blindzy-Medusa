import { Request, Response } from 'express'
import { initORM } from "../../../../../utils/orm";

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
    const conn = em.getConnection();

    // Build same enriched structure as list endpoint, scoped to one product
    const sql = `
      SELECT
        p.*,
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
        COALESCE(
          (
            SELECT json_agg(json_build_object('id', t.id, 'value', t.value))
            FROM product_tags jt
            JOIN product_tag t ON t.id = jt.product_tag_id
            WHERE jt.product_id = p.id
          ),
          '[]'::json
        ) AS tags,
        COALESCE(
          (
            SELECT json_agg(json_build_object('id', c.id, 'name', c.name, 'handle', c.handle))
            FROM product_category_product jpc
            JOIN product_category c ON c.id = jpc.product_category_id
            WHERE jpc.product_id = p.id
          ),
          '[]'::json
        ) AS categories,
        (
          SELECT to_json(pc)
          FROM product_collection pc
          WHERE pc.id = p.collection_id
        ) AS collection,
        (
          SELECT to_json(pt)
          FROM product_type pt
          WHERE pt.id = p.type_id
        ) AS type
      FROM product p
      WHERE p.deleted_at IS NULL AND p.id = ?
    `;

    const rows = await conn.execute(sql, [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }

    const product = rows[0];

    res.status(200).json({
      success: true,
      product
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
