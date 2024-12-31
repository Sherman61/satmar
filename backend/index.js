const express = require("express");
const cors = require("cors");
const inventoryRoutes = require("./routes/inventoryRoutes");
const labelRoutes = require("./routes/labelsRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use("/api", inventoryRoutes); // Inventory-related routes
app.use("/api", labelRoutes); // Label-related routes

// Global Error Handler
app.use(errorHandler);

module.exports = app;
