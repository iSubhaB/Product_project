import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Routes
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";

// Middlewares
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();
connectDB();

const app = express();

// Required for ES module __dirname resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

// routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);

// Test route
app.get("/", (req, res) => res.send("API running ✅"));

// Error handler (last)
app.use(errorHandler);

export default app;
