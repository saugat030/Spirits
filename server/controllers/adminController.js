import { dbConnect } from "../config/dbConnect.js";

export const addProduct = async (req, res) => {
  const { name, type_id, img_link, description, quantity, price } = req.body;

  if (!name || !price || !type || !quantity) {
    return res.status(400).json({ error: "You are missing some details." });
  }

  try {
    const db = await dbConnect();
    const result = db.query(
      `INSERT INTO products (name, type_id, image_link, description, quantity ,price)
         VALUES ($1, $2, $3, $4, $5 ,$6)
         RETURNING *`,
      [name, description, price, image_url, category]
    );
  } catch (err) {}
};
