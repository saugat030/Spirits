import { dbConnect } from "../config/dbConnect.js";

export const getOrderDetails = async (req, res) => {
  const { order_id } = req.params;
  try {
    const db = await dbConnect();
    //Basic order details fetching.
    const orderResult = await db.query(
      `
      SELECT order_id, user_id, creation_date, status 
      FROM orders 
      WHERE order_id = $1;
    `,
      [order_id]
    );
    //check if that order_id exists:
    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order details with such order_id not found.",
      });
    }
    const itemsResult = await db.query(
      `
      SELECT oi.spirit_id, oi.quantity, l.name 
      FROM order_items oi
      JOIN liquors l ON oi.spirit_id = l.id
      WHERE oi.order_id = $1
      
      ;
    `,
      [order_id]
    );
    const orderDetails = {
      order_id,
      user_id: orderResult.rows[0].user_id,
      creation_date: orderResult.rows[0].creation_date,
      status: orderResult.rows[0].status,
      items: itemsResult.rows,
    };
    db.release();
    res.status(200).json({
      success: true,
      order_details: orderDetails,
    });
  } catch (error) {
    console.error("Error fetching order details:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
/* /api/orders/create example use case :{
    "user_id": 4,
    "status": "pending",
    "price":450,
    "items": [
        {
            "product_id": 4,
            "quantity": 2
        },
        {
            "product_id": 2,
            "quantity": 1
        },
        {
            "product_id": 18,
            "quantity": 3
        }
    ]
}*/
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
