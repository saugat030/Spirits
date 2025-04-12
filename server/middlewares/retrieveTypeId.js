import { dbConnect } from "../config/dbConnect.js";
//this function converts the type_name into the equivalent type_id.
const retrieveTypeId = async (req, res, next) => {
  const { type_name } = req.body;
  console.log("Logging from retrieveTypId middleware: " + type_name);
  try {
    const db = await dbConnect();
    const result = await db.query(
      "select type_id from categories where type_name= ($1)",
      [type_name]
    );
    if (result.rows.length > 0) {
      const type_id = result.rows[0].type_id;
      req.body.type_id = type_id;
      console.log("The type_id is: " + type_id);
      next();
    } else {
      return res.json({
        success: false,
        message:
          "No such category ID found. Error from retrieveTypeId middlware.",
      });
    }
  } catch (err) {
    return res.json({ sucess: false, message: err.message });
  }
};
export default retrieveTypeId;
