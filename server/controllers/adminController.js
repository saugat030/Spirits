import { dbConnect } from "../config/dbConnect.js";

export const addProduct = async (req, res) => {
  const { name, type_id, image_link, description, quantity, price } = req.body;

  if (!name || !price || !type_id || !quantity) {
    return res.status(400).json({ error: "You are missing some details." });
  }

  try {
    const db = await dbConnect();
    const result = await db.query(
      `INSERT INTO liquors (name, type_id, image_link, description, quantity ,price)
         VALUES ($1, $2, $3, $4, $5 ,$6)
         RETURNING *`,
      [name, type_id, image_link, description, quantity, price]
    );
    console.log("Entry created successfully.");
    res.status(201).json({ success: true, statistics: result.rows[0] });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      error: "Server error while trying to add the product",
    });
  }
};
