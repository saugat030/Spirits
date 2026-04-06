import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import promotionRoutes from "./routes/promotionRoutes.js";
import { verifyConnection } from "./config/dbConnect.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));

const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = isProduction
  ? ["https://spirits-clkh.vercel.app", "https://spirits.vercel.app"]
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

// allows to send cookie as the response from the server.
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/promotions", promotionRoutes);

const startServer = async () => {
  try {
    await verifyConnection();
    // only start listening if DB is confirmed
    app.listen(port, () => {
      console.log(`Server verified and running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server due to DB connection issues:", error);
    process.exit(1);
  }
};

startServer();