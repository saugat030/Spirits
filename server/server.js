import express from "express";
import pg from "pg";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

//VVI for runnung projs in different port react ko arkai port ra express ko arkai port huda kam lagne.

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "spirits",
  password: "12345678",
  port: 5432,
});

db.connect();

//Get all Liquor:
app.get("/api/products", async (req, res) => {
  const type = req.query.type;
  let query;
  console.log(type);
  if (type) {
    try {
      const result = await db.query(
        "select id, name , image_link , description , quantity , categories.type_id , type_name from liquors join categories on liquors.type_id = categories.type_id where type_name = ($1) order by id asc",
        [type]
      );
      if (result.rows.length > 0) {
        const data = result.rows;

        //res.json le automatically js object lai jsonify handuinxa so no need :JSON.stringify(data);

        res.json(data);
      } else {
        console.log("No data in the table.");
        res.status(404).json({ message: "No products found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    try {
      const result = await db.query(
        "select id, name , image_link , description , quantity , categories.type_id , type_name from liquors join categories on liquors.type_id = categories.type_id order by id asc"
      );
      if (result.rows.length > 0) {
        const data = result.rows;

        //res.json le automatically js object lai jsonify handuinxa so no need :JSON.stringify(data);

        res.json(data);
      } else {
        console.log("No data in the table.");
        res.status(404).json({ message: "No products found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
