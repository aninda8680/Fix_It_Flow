import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import complaintRoutes from "./routes/complaints.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
console.log("JWT SECRET 👉", process.env.JWT_SECRET);

// 🔹 Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Fix-It-Flow Backend is running 🚀",
    status: "OK",
  });
});

// Connect to MongoDB (Atlas)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Connection Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Backend running at http://localhost:${process.env.PORT}`)
);
