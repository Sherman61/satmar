const db = require("../db");

const getInventory = async (req, res, next) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          inventory.id, 
          items.name, 
          items.category, 
          CAST(inventory.weight AS DECIMAL(10,2)) AS weight, 
          CAST(inventory.price AS DECIMAL(10,2)) AS price, 
          inventory.import_date
        FROM inventory
        JOIN items ON inventory.item_id = items.id
      `);
      res.json(rows);
    } catch (error) {
      next(error);
    }
  };
  
  

// Add an item to inventory
const addToInventory = async (req, res, next) => {
  try {
    const { item_id, weight, import_date } = req.body;

    if (!item_id || !weight || !import_date) {
      return res.status(400).json({ error: "item_id, weight, and import_date are required." });
    }

    // Get the item's price from the items table
    const [itemRows] = await db.query("SELECT price FROM items WHERE id = ?", [item_id]);
    if (itemRows.length === 0) {
      return res.status(404).json({ error: "Item not found." });
    }

    const pricePerUnit = itemRows[0].price;
    const price = pricePerUnit * weight;

    // Add the item to inventory
    await db.query(
      "INSERT INTO inventory (item_id, weight, price, import_date) VALUES (?, ?, ?, ?)",
      [item_id, weight, price, import_date]
    );

    res.status(201).json({ message: "Item added to inventory successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = { getInventory, addToInventory };
