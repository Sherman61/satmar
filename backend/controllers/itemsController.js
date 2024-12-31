const db = require("../db");

// Fetch all items
const getItems = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM items");
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Add a new item
const addItem = async (req, res, next) => {
  try {
    const { name, price, category } = req.body;
    if (!name || !price || !category) {
      res.status(400);
      throw new Error("Name, price, and category are required.");
    }
    await db.query("INSERT INTO items (name, price, category) VALUES (?, ?, ?)", [name, price, category]);
    res.status(201).json({ message: "Item added successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = { getItems, addItem };
