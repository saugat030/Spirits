import express from "express";
import pg from "pg";
const app = express();

app.use(express.urlencoded({ extended: true }));

//Get all Liquor:
app.get("/api/products", async (req, res) => {});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
