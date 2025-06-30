import { dbConnect } from "../config/dbConnect.js";

export const getAllSpirits = async (req, res) => {
  console.log("The API hit the endpoint: " + req.url);
  let page = Number(req.query.page || 1);
  let limit = Number(req.query.limit || 12);
  console.log("the requested page and the limit offset is : " + page, limit);
  let type = req.query.type;
  let name = req.query.name;
  type = type === "null" || type === "" ? null : type;
  name = name === "null" || name === "" ? null : name;
  console.log("The requested type and name is: " + type, name);

  const offset = (page - 1) * limit;

  if (type) {
    try {
      const db = await dbConnect();

      // Get total count for pagination
      const countResult = await db.query(
        "SELECT COUNT(*) FROM liquors JOIN categories ON liquors.type_id = categories.type_id WHERE type_name = ($1)",
        [type]
      );
      const total = parseInt(countResult.rows[0].count);

      // Get paginated data
      const result = await db.query(
        "SELECT id, name, image_link, description, quantity, categories.type_id, type_name, price FROM liquors JOIN categories ON liquors.type_id = categories.type_id WHERE type_name = ($1) ORDER BY id ASC LIMIT $2 OFFSET $3",
        [type, limit, offset]
      );

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
        });
      } else {
        console.log("No data in the table with that type.");
        return res.status(404).json({
          success: false,
          message: "No products found with that type",
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else if (name) {
    const searchKey = `%${name}%`;
    try {
      const db = await dbConnect();

      // Get total count for pagination
      const countResult = await db.query(
        "SELECT COUNT(*) FROM liquors JOIN categories ON liquors.type_id = categories.type_id WHERE name ILIKE ($1)",
        [searchKey]
      );
      const total = parseInt(countResult.rows[0].count);

      // Get paginated data
      const result = await db.query(
        "SELECT id, name, image_link, description, quantity, categories.type_id, type_name, price FROM liquors JOIN categories ON liquors.type_id = categories.type_id WHERE name ILIKE ($1) ORDER BY id ASC LIMIT $2 OFFSET $3",
        [searchKey, limit, offset]
      );

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
        });
      } else {
        console.log("No products found with that name");
        return res.status(404).json({
          success: false,
          message: "No products found with that name",
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    try {
      const db = await dbConnect();
      // Get total count for pagination
      const countResult = await db.query(
        "SELECT COUNT(*) FROM liquors JOIN categories ON liquors.type_id = categories.type_id"
      );
      const total = parseInt(countResult.rows[0].count);
      // Get paginated data
      const result = await db.query(
        `SELECT
              id,
              name,
              image_link,
              description,
              quantity,
              categories.type_id,
              type_name,
              price
           FROM
              liquors
           JOIN
              categories
           ON
              liquors.type_id = categories.type_id
           ORDER BY
              id ASC
           LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

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
        });
      } else {
        console.log("No data in the table.");
        return res.status(404).json({
          success: false,
          message: "No products found",
        });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
};

export const getSpiritsById = async (req, res) => {
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
      if (result.rows.length > 0) {
        const data = result.rows;

        //res.json le automatically js object lai jsonify handuinxa so no need :JSON.stringify(data);
        db.release();
        return res.status(200).json(data);
      } else {
        console.log("No data in the table.");
        res.status(404).json({ success: false, message: "No products found" });
      }
    } catch (err) {
      db.release();
      console.error(err);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  } else {
    try {
      const db = await dbConnect();
      const result = await db.query(
        "select id, name , image_link , description , quantity , categories.type_id , type_name , price from liquors join categories on liquors.type_id = categories.type_id order by id asc"
      );
      if (result.rows.length > 0) {
        const data = result.rows;
        //res.json le automatically js object lai jsonify handinxa so no need :JSON.stringify(data);
        db.release();
        return res.status(200).json({
          success: true,
          message: "Products fetched successfully.",
          data,
        });
      } else {
        console.log("No data in the table. Releasing Database...");
        db.release();
        res.status(404).json({ success: false, message: "No products found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
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
