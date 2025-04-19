import { dbConnect } from "../config/dbConnect.js";

export const getNetSales = async (req, res) => {
  try {
    const db = await dbConnect();
    const result = await db.query(
      `select spirit_id ,order_items.quantity , price from order_items join liquors on order_items.spirit_id= liquors.id`
    );
    if (result.rows.length <= 0) {
      return res.json({
        success: false,
        message: "No data fetched from the database.",
      });
    }
    const total = result.rows.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    return res.status(200).json({ success: true, netSales: total });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, message: err.message });
  }
};
export const totalProducts = async (req, res) => {
  try {
    const db = await dbConnect();
    const result = await db.query(`select quantity from order_items`);
    if (result.rows.length <= 0) {
      return res.json({
        success: false,
        message: "No data fetched from the database.",
      });
    }
    const totalQuantity = result.rows.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    console.log(totalQuantity);
    return res.status(200).json({
      success: true,
      totalProducts: totalQuantity,
    });
  } catch (err) {
    console.error(err.message);
  }
};
export const getProductSalesDetails = async (req, res) => {
  try {
    const db = await dbConnect();
    const result = await db.query(`select quantity from order_items`);
    if (result.rows.length <= 0) {
      return res.json({
        success: false,
        message: "No data fetched from the database.",
      });
    }
    const totalQuantity = result.rows.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    console.log(totalQuantity);
    return res.status(200).json({
      success: true,
      totalProducts: totalQuantity,
    });
  } catch (err) {
    console.error(err.message);
  }
};
