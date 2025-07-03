import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import ordersRoutes from "./routes/ordersRoute.js";
import statsRoutes from "./routes/statsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
// import { dbConnect } from "./config/dbConnect.js";
// import createAdmin from "./createAdmin.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//VVI for running projs in different port react ko arkai port ra express ko arkai port huda kam lagne.
app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);
//Allows to send cookie as the response from the server.
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/admin", adminRoutes);
// app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Server Running succesfully at PORT: " + port);
  // await createAdmin();
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
