import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userAuth from "./middlewares/userAuth.js";
// import userRoutes from "./routes/userRoutes.js";

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
// app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Server Running succesfully at PORT: " + port);
});
app.get("/admin/dashboard-data", userAuth, async (req, res) => {
  if (req.body.role != "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized user.GTFO" });
  }
  res.json({
    success: true,
    message: "Welcome to the Admin dashboard. You can now access admin Data",
  });
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
