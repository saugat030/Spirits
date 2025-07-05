import { dbConnect } from "../config/dbConnect.js";

export const getAllSpirits = async (req, res) => {
  console.log("The API hit the endpoint: " + req.url);
  let page = Number(req.query.page || 1);
  let limit = Number(req.query.limit || 12);
  console.log("the requested page and the limit offset is : " + page, limit);

  let type = req.query.type;
  let name = req.query.name;
  let minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
  let maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;

  type = type === "null" || type === "" ? null : type;
  name = name === "null" || name === "" ? null : name;

  console.log(
    "The requested type, name, and price range is: " + type,
    name,
    minPrice,
    maxPrice
  );

  const offset = (page - 1) * limit;

  try {
    const db = await dbConnect();

    // Build dynamic WHERE clause and parameters
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    // Add type filter
    if (type) {
      whereConditions.push(`type_name = $${paramIndex}`);
      queryParams.push(type);
      paramIndex++;
    }

    // Add name filter
    if (name) {
      whereConditions.push(`name ILIKE $${paramIndex}`);
      queryParams.push(`%${name}%`);
      paramIndex++;
    }

    // Add min price filter
    if (minPrice !== null) {
      whereConditions.push(`price >= $${paramIndex}`);
      queryParams.push(minPrice);
      paramIndex++;
    }

    // Add max price filter
    if (maxPrice !== null) {
      whereConditions.push(`price <= $${paramIndex}`);
      queryParams.push(maxPrice);
      paramIndex++;
    }

    // Build the WHERE clause
    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) 
      FROM liquors 
      JOIN categories ON liquors.type_id = categories.type_id 
      ${whereClause}
    `;

    const countResult = await db.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT 
        id, 
        name, 
        image_link, 
        description, 
        quantity, 
        categories.type_id, 
        type_name, 
        price 
      FROM liquors 
      JOIN categories ON liquors.type_id = categories.type_id 
      ${whereClause}
      ORDER BY id ASC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const dataParams = [...queryParams, limit, offset];
    const result = await db.query(dataQuery, dataParams);

    db.release();

    if (result.rows.length > 0) {
      const totalPages = Math.ceil(total / limit);
      const data = result.rows;

      return res.json({
        success: true,
        message: "Products fetched successfully",
        data,
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        filters: {
          type,
          name,
          minPrice,
          maxPrice,
        },
      });
    } else {
      console.log("No data found with the applied filters.");
      return res.status(404).json({
        success: false,
        message: "No products found with the applied filters",
      });
    }
  } catch (err) {
    console.error(err);
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

export const getSpiritsByPrice = async (req, res) => {
  let { min } = req.query;
  let { max } = req.query;
  console.log("A req has hit the api endpoint: " + req.url);
  console.log("The fiilter for min price and max price are : " + min, max);
  try {
    const db = await dbConnect();
    const result = await db.query(
      "select * from liquors join categories on liquors.type_id = categories.type_id where price > ($1) and price < ($2) order by price asc",
      [min, max]
    );
    if (result.rows.length > 0) {
      return res.json(result.rows);
    } else {
      res.json({
        success: false,
        message: "No products with such price filter found",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
