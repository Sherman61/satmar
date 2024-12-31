const express = require("express");
const router = express.Router();
const { createLabel } = require("../controllers/labelsController");
const db = require("../db");

// Route for creating a label
router.post("/label-maker", createLabel);

router.get("/labels", async (req, res) => {
    try {
      const [labels] = await db.query("SELECT * FROM labels");
      res.json(labels);
    } catch (error) {
      console.error("Error fetching labels:", error); // Log the full error for debugging
      res.status(500).send("Internal Server Error");
    }
  });
  router.get("/labels/:labelCode", async (req, res) => {
    try {
      const { labelCode } = req.params;
  
      const [labelRows] = await db.query("SELECT * FROM labels WHERE label_code = ?", [labelCode]);
      if (labelRows.length === 0) {
        return res.status(404).json({ error: "Label not found." });
      }
  
      const label = labelRows[0];
      const itemIds = label.item_ids ? label.item_ids.split(",").map(Number) : [];
  
      const [items] = itemIds.length > 0
        ? await db.query(
            `SELECT 
               inventory.id, 
               inventory.item_id, 
               inventory.weight, 
               inventory.price, 
               items.name 
             FROM inventory
             JOIN items ON inventory.item_id = items.id
             WHERE inventory.id IN (?)`,
            [itemIds]
          )
        : [[]];
  
      // Transform items to ensure correct structure
      const simplifiedItems = items.map((item) => ({
        id: item.id,
        item_id: item.item_id,
        weight: item.weight,
        price: item.price,
        name: item.name,
      }));
  
      res.json({ label, items: simplifiedItems });
    } catch (error) {
      console.error("Error fetching label:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  

  router.patch("/labels/:labelCode/remove-item", async (req, res) => {
    try {
      const { labelCode } = req.params;
      const { item_id } = req.body;
  
      const [labelRows] = await db.query("SELECT * FROM labels WHERE label_code = ?", [labelCode]);
      if (labelRows.length === 0) {
        return res.status(404).json({ error: "Label not found" });
      }
  
      const label = labelRows[0];
      const itemIds = label.item_ids.split(",").map((id) => parseInt(id, 10));
  
      if (!itemIds.includes(item_id)) {
        return res.status(400).json({ error: "Item not associated with this label" });
      }
  
      const updatedItemIds = itemIds.filter((id) => id !== item_id);
  
      await db.query("UPDATE labels SET item_ids = ? WHERE label_code = ?", [updatedItemIds.join(","), labelCode]);
  
      res.json({ message: "Item removed from label" });
    } catch (error) {
      console.error("Error removing item from label:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  router.patch("/labels/:labelCode/add-item", async (req, res) => {
    try {
      const { labelCode } = req.params;
      const { item_id, source, weight } = req.body;
  
      if (!item_id || !source) {
        return res.status(400).json({ error: "Item ID and source are required." });
      }
  
      if (source === "items" && (!weight || weight <= 0)) {
        return res.status(400).json({ error: "Weight is required for items and must be greater than zero." });
      }
  
      const [labelRows] = await db.query("SELECT * FROM labels WHERE label_code = ?", [labelCode]);
      if (labelRows.length === 0) {
        return res.status(404).json({ error: "Label not found." });
      }
  
      const label = labelRows[0];
      const currentItemIds = label.item_ids ? label.item_ids.split(",").map(Number) : [];
  
      if (currentItemIds.includes(item_id)) {
        return res.status(400).json({ error: "Item already associated with this label." });
      }
  
      if (source === "items") {
        // Insert item into inventory with weight
        const [itemRows] = await db.query("SELECT * FROM items WHERE id = ?", [item_id]);
        if (itemRows.length === 0) {
          return res.status(404).json({ error: "Item not found in items table." });
        }
  
        const price = itemRows[0].price * weight;
        const [inventoryResult] = await db.query(
          "INSERT INTO inventory (item_id, weight, price, import_date) VALUES (?, ?, ?, NOW())",
          [item_id, weight, price]
        );
  
        currentItemIds.push(inventoryResult.insertId);
      } else if (source === "inventory") {
        // Validate that the item exists in the inventory
        const [inventoryRows] = await db.query("SELECT * FROM inventory WHERE id = ?", [item_id]);
        if (inventoryRows.length === 0) {
          return res.status(404).json({ error: "Item not found in inventory." });
        }
  
        currentItemIds.push(item_id);
      }
  
      await db.query("UPDATE labels SET item_ids = ? WHERE label_code = ?", [currentItemIds.join(","), labelCode]);
  
      res.json({ message: "Item added to label successfully." });
    } catch (error) {
      console.error("Error adding item to label:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  
  router.delete("/inventory/:itemId", async (req, res) => {
    try {
      const { itemId } = req.params;
  
      // Delete item from inventory
      await db.query("DELETE FROM inventory WHERE id = ?", [itemId]);
  
      // Update labels to remove the item from their item_ids
      const [labels] = await db.query("SELECT * FROM labels WHERE FIND_IN_SET(?, item_ids)", [itemId]);
  
      for (const label of labels) {
        const itemIds = label.item_ids.split(",").map((id) => parseInt(id, 10));
        const updatedItemIds = itemIds.filter((id) => id !== parseInt(itemId, 10));
  
        await db.query("UPDATE labels SET item_ids = ? WHERE label_id = ?", [updatedItemIds.join(","), label.label_id]);
      }
  
      res.json({ message: "Item deleted from inventory and labels" });
    } catch (error) {
      console.error("Error deleting item:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  
module.exports = router;
