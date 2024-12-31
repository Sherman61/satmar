const express = require("express");
const cors = require("cors");
const labelsRoutes = require("./routes/labelsRoutes"); // Import the labels route
const inventoryRoutes = require("./routes/inventoryRoutes");
const itemsRoutes = require("./routes/itemsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Register routes
app.use("/api", labelsRoutes);
app.use("/api", inventoryRoutes);
app.use("/api", itemsRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

module.exports = app;
