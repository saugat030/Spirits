import { dbConnect } from "../config/dbConnect.js";

export const getOrderDetails = async (req, res) => {};

export const createOrder = async (req, res) => {
  const { user_id, status, items, price } = req.body;
  console.log("Order Creation endpoint hit " + req.url);
  console.log("Provided details are: " + user_id, status, items, price);
  const db = await dbConnect();
  try {
    await db.query("BEGIN");

    const ordersResult = await db.query(
      `INSERT INTO orders (user_id, creation_date, status)
         VALUES ($1, NOW(), $2) RETURNING *`,
      [user_id, status]
    );

    const order_id = ordersResult.rows[0].order_id;

    for (const item of items) {
      await db.query(
        `INSERT INTO order_items (order_id, spirit_id, quantity)
           VALUES ($1, $2, $3)`,
        [order_id, item.product_id, item.quantity]
      );
    }
    await db.query("COMMIT");
    res.status(201).json({
      success: true,
      order_id,
      added_entry: ordersResult.rows,
    });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Order creation failed:", error.message);
    res.status(500).json({ success: false, message: "Order creation failed" });
  } finally {
    db.release();
  }
};
