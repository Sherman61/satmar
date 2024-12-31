const { v4: uuidv4 } = require("uuid");
const db = require("../db");

const createLabel = async (req, res, next) => {
  try {
    const { items, import_date } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items array is required and cannot be empty." });
    }
    if (!import_date) {
      return res.status(400).json({ error: "Import date is required." });
    }

    // Generate a unique label_code
    const labelCode = `LBL-${Date.now()}`; 
    // const labelCode = `LBL-${uuidv4()}`; //extra length
    console.log("Generated label_code:", labelCode);

    const itemIds = [];
    for (const { item_id, weight } of items) {
      const [itemRows] = await db.query("SELECT price FROM items WHERE id = ?", [item_id]);
      if (itemRows.length === 0) {
        throw new Error(`Item with id ${item_id} not found.`);
      }

      const pricePerUnit = itemRows[0].price;
      const price = pricePerUnit * weight;

      const [inventoryResult] = await db.query(
        "INSERT INTO inventory (item_id, weight, price, import_date) VALUES (?, ?, ?, ?)",
        [item_id, weight, price, import_date]
      );

      itemIds.push(inventoryResult.insertId);
    }

    console.log("Inserting into labels table with values:", [labelCode, itemIds.join(","), import_date]);

    await db.query(
      "INSERT INTO labels (label_code, item_ids, import_date) VALUES (?, ?, ?)",
      [labelCode, itemIds.join(","), import_date]
    );

    res.status(201).json({ message: "Label created successfully", label_code: labelCode });
  } catch (error) {
    console.error("Error creating label:", error.message);
    next(error);
  }
};

module.exports = { createLabel };
