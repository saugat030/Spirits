import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// tsconfig uses "module": "nodenext", ts strictly requires the .js extension for local imports, even if the actual file is .ts or .js.
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import ordersRoutes from "./routes/ordersRoute.js";
import statsRoutes from "./routes/statsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { verifyConnection } from "./config/dbConnect.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit: "10mb"}));

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
app.use("/api/stats", statsRoutes);
app.use("/api/admin", adminRoutes);

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