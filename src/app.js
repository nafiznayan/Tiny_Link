import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import urlRoutes from "./routes/url/index.js";
import redirectRoutes from "./routes/redirect/index.js";
import viewRoutes from "./routes/views/index.js";
import { notFoundError, errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Routes

// API routes (JSON)
app.use("/api/urls", urlRoutes);

// View routes (EJS pages)
app.use(viewRoutes);

// Redirect route (catch-all for /:shortCode)
app.use(redirectRoutes);

// Error Handling
app.use(notFoundError);
app.use(errorHandler);

export default app;
