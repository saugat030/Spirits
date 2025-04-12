import { dbConnect } from "../config/dbConnect.js";
const retrieveTypeId = async (req, res, next) => {
  const { type_name } = req.body;
  try {
    const db = await dbConnect();
    const result = db.query(
      "select type_id from categories where type_name= ($1)",
      [type_name]
    );
  } catch (err) {}
};
