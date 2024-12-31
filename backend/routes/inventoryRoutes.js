const express = require("express");
const { getInventory, addToInventory } = require("../controllers/inventoryController");

const router = express.Router();
router.get("/inventory", getInventory);
router.post("/inventory", addToInventory);

module.exports = router;
