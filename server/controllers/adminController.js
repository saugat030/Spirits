import { dbConnect } from "../config/dbConnect.js";

export const greetAdmin = async (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Admin dashboard.",
  });
};
export const addProduct = async (req, res) => {
  if (req.body.role != "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized user.GTFO" });
  }
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
//sample data :{}
export const updateProduct = async (req, res) => {
  const product_id = parseInt(req.params.id);
  const { name, type_id, image_link, description, quantity, price } = req.body;
  console.log("A POST request has hit the endpoint: " + req.url);
  console.log("A requested product to update for the id : " + product_id);
  try {
    const db = await dbConnect();
    const result = await db.query(
      `UPDATE liquors
       SET name = $1,
           type_id = $2,
           image_link = $3,
           description = $4,
           quantity = $5,
           price = $6
       WHERE id = $7
       RETURNING *`,
      [name, type_id, image_link, description, quantity, price, product_id]
    );
    if (result.rowCount === 0) {
      db.release();
      console.log("Unable to find the product with the ID.");
      return res.status(404).json({
        success: false,
        error: `Unable to find such product with the ID:${product_id}`,
      });
    }
    res.json({ success: true, statistics: result.rows[0] });
    console.log("Product updated successfully.");
    db.release();
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      error: "Server error while trying to update the product",
    });
  }
};
export const deleteProduct = async (req, res) => {
  if (req.body.role != "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized user.GTFO" });
  }
  const product_id = parseInt(req.params.id);

  console.log("A POST request has hit the endpoint: " + req.url);
  console.log("A requested product to delete for the id : " + product_id);
  try {
    const db = await dbConnect();
    const result = await db.query(
      "DELETE FROM liquors WHERE id = $1 RETURNING *",
      [product_id]
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Product with such id not found to Delete." });
    }
    res.json({
      success: true,
      message: "Product deleted",
      statistics: result.rows[0],
    });
  } catch (err) {
    console.error("Delete error:", err);
    res
      .status(500)
      .json({ message: "Server error while trying to delete the product." });
  }
};
export const getUsers = async (req, res) => {
  console.log("Fetch users route hit: " + req.url);
  try {
    const db = await dbConnect();
    const result = await db.query(
      "select id , name , email , role , isverified from users"
    );
    if (result.rowCount <= 0) {
      return res.json({
        succes: false,
        message: "Unable to fetch any records.",
      });
    }
    res.status(200).json({ success: true, statistics: result.rows });
    console.log("User data fetched. Releasing db client.");
    db.release();
  } catch (err) {
    console.error(err.message);
    res.json({ success: false, message: "Server error while fetching users." });
  }
};
export const updateUsers = async (req, res) => {
  console.log("Update users route hit: " + req.url);
  const user_id = parseInt(req.params.id);
  //req.body.role clashes with the middleware userAuth.
  const { name, email, userRole, isVerified } = req.body;
  console.log("A requested user to update for the id : " + user_id);

  try {
    const db = await dbConnect();
    const result = await db.query(
      `UPDATE users
       SET name = $1,
           email = $2,
           role = $3,
           isverified = $4
       WHERE id = $5
       RETURNING name, email, isverified, role`,
      [name, email, userRole, isVerified, user_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: `Unable to find such user with the ID:${user_id}`,
      });
    }
    res.json({ success: true, statistics: result.rows[0] });
    console.log("Successfully updated user. Releasing client...");
    db.release();
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      error: "Server error while trying to update the user entry",
    });
  }
};
