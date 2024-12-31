const bcrypt = require("bcrypt");
const db = require("./db"); // Update with your database connection setup

const addUser = async () => {
  try {
    const name = "Shiya Sherman";
    const admin = true;
    const pin = "3056";
    
    // Hash the PIN
    const hashedPin = await bcrypt.hash(pin, 10);

    // Insert into the database
    const query = "INSERT INTO users (name, admin, pin) VALUES (?, ?, ?)";
    const values = [name, admin, hashedPin];
    await db.query(query, values);

    console.log("User added successfully!");
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

addUser();
