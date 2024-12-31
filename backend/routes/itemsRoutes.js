const express = require("express");
const { getItems, addItem } = require("../controllers/itemsController");

const router = express.Router();
router.get("/items", getItems);
router.post("/items", addItem);

module.exports = router;
