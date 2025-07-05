import { dbConnect } from "../config/dbConnect.js";

export const getAllSpirits = async (req, res) => {
  console.log("API Hit:", req.url);

  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 12);
  const offset = (page - 1) * limit;

  let { type, name, minPrice, maxPrice } = req.query;

  // Normalize input values
  const types = Array.isArray(type)
    ? type
    : type && type !== "null" && type !== ""
    ? [type]
    : null;

  name = name === "null" || name === "" ? null : name;

  // Add validation for price values
  minPrice = minPrice && !isNaN(Number(minPrice)) ? Number(minPrice) : null;
  maxPrice = maxPrice && !isNaN(Number(maxPrice)) ? Number(maxPrice) : null;

  // Ensure minPrice is not greater than maxPrice
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    return res.status(400).json({
      success: false,
      message: "Minimum price cannot be greater than maximum price",
    });
  }

  console.log("Filters:", { types, name, minPrice, maxPrice });

  try {
    const db = await dbConnect();
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    // Multiple types using = ANY($n)
    if (types && types.length > 0) {
      // Added length check
      whereConditions.push(`type_name = ANY($${paramIndex})`);
      queryParams.push(types);
      paramIndex++;
    }

    // Name filter
    if (name) {
      whereConditions.push(`name ILIKE $${paramIndex}`);
      queryParams.push(`%${name}%`);
      paramIndex++;
    }

    if (minPrice !== null) {
      whereConditions.push(`price >= $${paramIndex}`);
      queryParams.push(minPrice);
      paramIndex++;
    }

    if (maxPrice !== null) {
      whereConditions.push(`price <= $${paramIndex}`);
      queryParams.push(maxPrice);
      paramIndex++;
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Count total items
    const countQuery = `
      SELECT COUNT(*) 
      FROM liquors 
      JOIN categories ON liquors.type_id = categories.type_id 
      ${whereClause}
    `;
    const countResult = await db.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Data query with pagination
    const dataQuery = `
      SELECT 
        id, name, image_link, description, quantity,
        categories.type_id, type_name, price 
      FROM liquors 
      JOIN categories ON liquors.type_id = categories.type_id 
      ${whereClause}
      ORDER BY id ASC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const dataParams = [...queryParams, limit, offset];
    const result = await db.query(dataQuery, dataParams);
    db.release();

    // Always return success response with data (even if empty)
    const totalPages = Math.ceil(total / limit);
    return res.json({
      success: true,
      message:
        result.rows.length > 0
          ? "Products fetched successfully"
          : "No products found with the applied filters",
      data: result.rows,
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      filters: { type: types, name, minPrice, maxPrice },
    });
  } catch (err) {
    console.error("Error fetching spirits:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getSpiritsById = async (req, res) => {
  //parsing is necessary here kinaki query string "string" ma aauxa
  const id = parseInt(req.params.id);
  console.log("A request has hit the endpoint: " + req.url);
  console.log("A requested product for the id : " + id);
  if (id) {
    try {
      const db = await dbConnect();
      const result = await db.query(
        "select id, name , image_link , description , quantity , categories.type_id , type_name , price from liquors join categories on liquors.type_id = categories.type_id where id = ($1) order by id asc",
        [id]
      );
      db.release();
      if (result.rows.length > 0) {
        const data = result.rows[0];
        //res.json le automatically js object lai jsonify handuinxa so no need :JSON.stringify(data);
        return res.status(200).json({
          success: true,
          message: `Product with the ID: ${id} fetched successfully.`,
          data,
        });
      } else {
        console.log("No data in the table for that id");
        res
          .status(404)
          .json({ success: false, message: "No products found with that ID" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  } else {
    console.log("No data in the table for that id");
    res
      .status(404)
      .json({ success: false, message: "No products found with that ID" });
  }
};
